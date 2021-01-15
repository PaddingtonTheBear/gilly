import { Database } from './../database/database';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import chalk from 'chalk';

import { User } from '../../../../libs/entities/auth/user';
import config from '../config';
import { entityMap } from '../../../../libs/entities/_entity-map';

export class UserController {
	async listAll(req: Request, res: Response) {
		//Get users from database
		const userRepository = getRepository(User);
		const users = await userRepository.find();

		users.forEach((user) => {
			delete user.password;
		});

		//Send the users object
		res.send(users);
	}

	async getOneById(req: Request, res: Response) {
		//Get the ID from the url
		const id: string = req.params.id;

		//Get the user from database
		const userRepository = getRepository(User);
		try {
			const user = await userRepository.findOneOrFail(id);

			delete user.password;

			res.status(201).send(user);
		} catch (error) {
			res.status(404).send('User not found');
		}
	}

	async newUser(req: Request, res: Response) {
		//Get parameters from the body
		let { username, password, email, roles } = req.body;
		let user = new User();
		user.username = username;
		user.password = password;
		user.email = email;
		user.roles = roles;

		// const { adminUser } = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);

		// TODO: Validade if the parameters are ok

		//Hash the password, to securely store on DB
		this.hashPassword(user);

		//Try to save. If fails, the username is already in use
		const entityName = req.params.entity;
		const entityModel = entityMap[entityName];
		const userRepository: Repository<any> = entityName
			? getRepository(entityModel)
			: getRepository(User);
		try {
			await userRepository.save(<any>user);
		} catch (e) {
			res.status(409).send('Username already in use!');
			return;
		}

		delete user.password;

		//If all ok, send 201 response
		console.log(`CREATE USER: ${chalk.magenta(user.username)}`);
		res.status(201).send(user);
	}

	async editUser(req: Request, res: Response) {
		//Get the ID from the url
		const id = req.params.id;

		//Get values from the body
		const { username, password, roles, email, isLocked, numFailedLogin } = req.body;

		const { adminUser } = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);

		//Try to find user on database
		const entityName = req.params.entity;
		const entityModel = entityMap[entityName];
		const userRepository: Repository<any> = entityName
			? getRepository(entityModel)
			: getRepository(User);
		let user;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (error) {
			//If not found, send a 404 response
			res.status(404).send('User not found');
			return;
		}

		//Validate the new values on model
		user.username = username;
		user.roles = roles;
		user.email = email;
		user.isLocked = isLocked || false;
		user.numFailedLogin = numFailedLogin || 0;

		if (password) {
			user.password = password;
			this.hashPassword(user);
		}

		//Try to save, if fails, that means username already in use
		try {
			await userRepository.save(user);
		} catch (e) {
			console.error(e);
			res.status(409).send('username already in use');
			return;
		}
		//After all send a 204 (no content, but accepted) response
		console.log(
			`EDIT USER: ${chalk.magenta(user.username)} | BY ADMIN: ${chalk.red(
				adminUser?.username
			)}`
		);
		res.status(204).send();
	}

	async deleteUser(req: Request, res: Response) {
		//Get the ID from the url
		const id = req.params.id;

		const { adminUser } = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);

		const entityName = req.params.entity;
		const entityModel = entityMap[entityName];
		const userRepository: Repository<any> = entityName
			? getRepository(entityModel)
			: getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (error) {
			res.status(404).send('User not found');
			return;
		}
		userRepository.delete(id);

		//After all send a 204 (no content, but accepted) response
		console.log(
			`DELETE USER: ${chalk.magenta(user.username)} | BY ADMIN: ${chalk.red(
				adminUser?.username
			)}`
		);
		res.status(204).send();
	}

	async getCurrentUser(req: Request, res: Response) {
		// Get the jwt token from the head
		const authHeader = <string>req.headers['authorization'];
		if (!authHeader || !authHeader.includes('Bearer')) {
			res.status(408).send('No Authorization Header or Bearer token presented!');
			return;
		}

		const token = authHeader.split('Bearer')[1].trim();
		let jwtPayload;

		// Try to validate the token and get data
		try {
			jwtPayload = <any>jwt.verify(token, config.jwtSecret);
			res.locals.jwtPayload = jwtPayload;
		} catch (error) {
			// If token is not valid, respond with 401 (unauthorized)
			res.status(401).send();
			return;
		}

		// The token is valid for 1 hour
		// We want to send a new token on every request
		const { userId, username } = jwtPayload;

		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(userId);
		} catch (error) {
			res.status(404).send('User not found');
			return;
		}

		delete user.password;

		res.status(201).send(user);
	}

	async hashPassword(userEntity: User) {
		userEntity.password = bcrypt.hashSync(userEntity.password, 8);
	}
}
