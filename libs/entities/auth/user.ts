import { Column, Entity, ManyToMany, Unique } from 'typeorm';

import { AuthRole } from './auth-role';
import { BaseUser } from './base-user';

@Entity({
	name: 'auth_user',
	orderBy: {
		username: 'ASC'
	}
})
@Unique(['username'])
export class User extends BaseUser {
	static displayName = 'User';

	@ManyToMany((type) => AuthRole, (role) => role.users, { eager: true, cascade: true })
	authRoles?: AuthRole[];

	static relationships = [{ model: AuthRole, name: 'roles' }];
}
