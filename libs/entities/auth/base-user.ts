import { Column } from 'typeorm';

import { BaseModel } from '../base';

export class BaseUser extends BaseModel {
	@Column({ nullable: true })
	username?: string;

	@Column({ nullable: true })
	password?: string;

	@Column({
		nullable: true,

		length: 255
	})
	email?: string;

	@Column({
		nullable: true,
		default: 0
	})
	numSuccessfulLogin?: number;

	@Column({
		nullable: true,
		default: 0
	})
	numFailedLogin?: number;

	@Column({ nullable: true })
	lastLoggedInDate?: Date;

	@Column({ default: false })
	isLocked?: boolean;

	@Column('simple-array', { nullable: true })
	roles?: string[];

	jwt?: string;
	expiry?: Date;
}
