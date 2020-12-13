import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseModel } from '../base';
import { Kid } from '../kid-money/kid';
import { KMTransaction } from '../kid-money/km-transaction';

@Entity()
export class Picture extends BaseModel {
	@Column({ nullable: true })
	url?: string;

	@Column({ nullable: true })
	fileName?: string;

	@Column({ nullable: true })
	type?: string;

	@Column({ nullable: true })
	extension?: string;

	@Column({ nullable: true })
	lastModifiedDate?: Date;

	@Column({ nullable: true })
	size: number;

	// RELATIONSHIPS
	@ManyToOne((type) => Kid, (kid) => kid.pictures)
	kid?: Kid;

	@ManyToOne((type) => KMTransaction, (kmTransaction) => kmTransaction.pictures)
	kmTransaction?: KMTransaction;

	file?: any;

	static async preProcess?(entity, dbConnection) {
		if (entity.name) {
			entity.extension = entity.name.split('.')[1];
		}
		console.log(entity.file);
	}
}
