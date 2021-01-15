import { getRepository } from 'typeorm';

import { AuthRole } from '../../../../../libs/entities/auth/auth-role';
import { User } from '../../../../../libs/entities/auth/user';
import { UserController } from '../../controllers/userController';

export async function createAdminUser() {
	const adminUser: User = await getRepository(User)
		.createQueryBuilder('user')
		.where('user.username = :username', { username: 'superadmin' })
		.getOne();

	let superadminRole: AuthRole = await getRepository(AuthRole)
		.createQueryBuilder('role')
		.where('role.role = :role', { role: 'superadmin' })
		.getOne();
	if (!superadminRole) {
		let superadmin = new AuthRole();
		superadmin.role = 'superadmin';
		const roleRepository = getRepository(AuthRole);
		superadminRole = await roleRepository.save(superadmin);
	}

	if (!adminUser) {
		console.log('Creating Admin User...');

		let user = new User();
		user.username = 'superadmin';
		user.password = 'superadmin';
		new UserController().hashPassword(user);
		user.email = 'aDm!n@admin.com';
		user.authRoles = [superadminRole];
		user.roles = ['superadmin'];
		const adminUser = await getRepository(User).save(user);

		console.log('Created Admin User! ', JSON.stringify(adminUser));
	} else {
		if (!adminUser.roles || !adminUser.roles.length) {
			adminUser.authRoles = [superadminRole];
			adminUser.roles = ['superadmin'];

			console.log(`Updated Super Admin User!`);
		}
	}

	// Setup other roles needed by the system too
	let userRole: AuthRole = await getRepository(AuthRole)
		.createQueryBuilder('role')
		.where('role.role = :role', { role: 'user' })
		.getOne();
	if (!userRole) {
		let user = new AuthRole();
		user.role = 'user';
		const roleRepository = getRepository(AuthRole);
		userRole = await roleRepository.save(user);
	}

	let guestRole: AuthRole = await getRepository(AuthRole)
		.createQueryBuilder('role')
		.where('role.role = :role', { role: 'guest' })
		.getOne();
	if (!guestRole) {
		let guest = new AuthRole();
		guest.role = 'guest';
		const roleRepository = getRepository(AuthRole);
		guestRole = await roleRepository.save(guest);
	}
}
