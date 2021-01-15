import * as bcrypt from 'bcryptjs';
import chalk from 'chalk';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { entityMap } from '../../../../libs/entities/_entity-map';
import { AuthRole } from '../../../../libs/entities/auth/auth-role';
import config from '../config';
import { User } from './../../../../libs/entities/auth/user';
import { UserController } from './userController';

const loginAttempts = 3;

export class AuthController {
	private userRepository;

	private getUserRepository() {
		if (!this.userRepository) {
			this.userRepository = getRepository(User);
		}
	}

	async login(req: Request, res: Response) {
		this.getUserRepository();

		//Check if username and password are set
		let { username, email, password } = req.body;
		if (!((username || email) && password)) {
			res.status(400).send(`You didn't enter a username or password...`);
			console.log(`LOGIN: Username or Password not found; failed to log in!`);
			return;
		}

		let userRepoToUse = this.userRepository;
		const entityName = req.params.entity;
		const entityModel = entityMap[entityName];
		if (entityModel) userRepoToUse = getRepository(entityModel);

		//Get user from database
		let user: User;
		try {
			user = await userRepoToUse.findOneOrFail({ where: [{ username }, { email }] });
		} catch (error) {
			res.status(401).send(
				'Account was not found, please check your username / e-mail and try again.'
			);
			console.log(
				`LOGIN${entityName ? '-' + entityName : ''}: User ${chalk.magenta(
					username
				)} not found; failed to log in!`
			);
			return;
		}

		if (user.numFailedLogin >= loginAttempts || user.isLocked) {
			const attemptsRemaining = loginAttempts - user.numFailedLogin;
			user.isLocked = user.isLocked || attemptsRemaining <= 0;
			await userRepoToUse.save(user); // increment num failed login counter

			res.status(401).send('Account is locked; please contact an administrator!');
			console.log(
				`LOGIN${entityName ? '-' + entityName : ''}: User ${chalk.magenta(
					username
				)} has a locked account.`
			);
			return;
		}

		//Check if encrypted password match
		const isValidPassword = await this.checkIfUnencryptedPasswordIsValid(password, user);
		if (!isValidPassword) {
			user.numFailedLogin++;
			const attemptsRemaining = loginAttempts - user.numFailedLogin;
			user.isLocked = user.isLocked || attemptsRemaining <= 0;
			await userRepoToUse.save(user); // increment num failed login counter

			res.status(401).send(
				`You entered a wrong username, e-mail or password. ${
					attemptsRemaining > 0
						? attemptsRemaining + ' login attempts remaining before account is locked!'
						: 'Account is now LOCKED!'
				} `
			);
			console.log(
				`LOGIN${entityName ? '-' + entityName : ''}: User ${chalk.magenta(
					user.username
				)} wrong password; failed to log in!`
			);

			return;
		}

		await this.handleUserLogin(res, user);
	}

	async loginCertificate(req: Request | any, res: Response) {
		this.getUserRepository();

		if (!req.connection.getPeerCertificate) {
			res.status(500).send(
				`Token login not implemented on the server, please use username / password...`
			);
			return; // SSL not enabled, don't try to do anything else
		}

		if (!req.client.authorized) {
			res.status(401).send(`Unauthorized: Client certificate not authorized!`);
			return;
		}

		// Get certificate details
		const cert = req.connection.getPeerCertificate(true);
		if (!cert || !Object.keys(cert).length) {
			res.status(401).send(
				`Client certificate was authenticated, but certificate information could not be retrieved...`
			);
			return;
		}

		const [lastName, firstName] = [...cert.subject.CN.toLowerCase().split('.')];
		const certUsername = `${firstName}.${lastName}`;

		let user: User;
		try {
			user = await this.userRepository.findOneOrFail({ where: [{ username: certUsername }] });
		} catch (error) {
			user = await this.createUser(certUsername);
			console.info(
				`Didn't find an existing user for presented Certificate, created a new user: ${chalk.magenta(
					certUsername
				)}!`
			);
		}

		await this.handleUserLogin(res, user);
	}

	async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, userEntity: User) {
		const isValid = bcrypt.compareSync(unencryptedPassword, userEntity.password);
		return isValid;
	}

	async changePassword(req: Request, res: Response) {
		this.getUserRepository();

		//Get ID from JWT
		const id = res.locals.jwtPayload.userId;

		//Get parameters from the body
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) {
			res.status(400).send();
		}

		//Get user from the database
		let user: User;
		try {
			user = await this.userRepository.findOneOrFail(id);
		} catch (id) {
			res.status(401).send();
		}

		//Check if old password matches
		const isOldPasswordValid = await this.checkIfUnencryptedPasswordIsValid(oldPassword, user);
		if (!isOldPasswordValid) {
			res.status(401).send(`New password must be different than the previous...`);
			return;
		}

		// TODO: Validate the model (password length)
		user.password = newPassword;

		//Hash the new password and save
		new UserController().hashPassword(user);
		this.userRepository.save(user);

		res.status(204).send();
	}

	private async handleUserLogin(res: Response, user: User) {
		//Sign JWT, valid for 10 hours
		const token = jwt.sign(
			{
				userId: user.id,
				username: user.username,
				roles: (user.roles || []).map((r: any) => {
					return { role: r.role || r };
				})
			},
			config.jwtSecret,
			{
				expiresIn: '10h'
			}
		);

		// Delete user pass
		delete user.password;

		console.log(`LOGIN: User ${chalk.magenta(user.username)} successfully logged in!`);
		user.numSuccessfulLogin++;
		user.numFailedLogin = 0;
		user.lastLoggedInDate = new Date();
		await this.userRepository.save(user); // increment num successful login counter

		//Send the jwt in the response
		res.send(Object.assign({ jwt: token }, user));
	}

	private async createUser(username, roles?) {
		const randomPassword = require('generate-password').generate({
			length: 14,
			numbers: true,
			symbols: true
		});

		if (!roles) {
			const authRoleRepository = getRepository(AuthRole);
			let guestRole = await authRoleRepository.findOne({ where: { role: 'guest' } });
			if (!guestRole) {
				let guest = new AuthRole();
				guest.role = 'guest';
				guestRole = await authRoleRepository.save(guest);
			}

			roles = [guestRole];
		}

		let user: User;
		user = new User({
			username: username,
			password: randomPassword,
			roles: roles,
			lastLoggedInDate: new Date(),
			numSuccessfulLogin: 0,
			numFailedLogin: 0,
			isLocked: false
		});

		new UserController().hashPassword(user);
		const createdUser = await this.userRepository.save(user);

		return createdUser;
	}
}
