import { Entity, OneToMany } from 'typeorm';

import { BaseUser } from '../auth/base-user';
import { Kid } from './kid';

@Entity()
export class KMParent extends BaseUser {
	static displayName = 'KMParent';

	@OneToMany((type) => Kid, (kid) => kid.parent)
	kids?: Kid[];

	relationships = [{ model: Kid, name: 'kids', modelName: 'Kid' }];
}
