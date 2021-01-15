import { User } from './../auth/user';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseModel } from '../base';
import { Kid } from './kid';

@Entity()
export class KMParent extends User {
	static displayName = 'KMParent';
	
	@OneToMany((type) => Kid, kid => kid.parent)
	kids?: Kid[];

	relationships = [
		{ model: Kid, name: 'kids', modelName: 'Kid' }
	];
}
