import { logDataTransaction, logDataTransactionError } from './log-data-transaction';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { FindManyOptions, getManager, IsNull } from 'typeorm';

import { entityMap } from '../../../../../libs/entities/_entity-map';
import { checkModelAllowedRoles } from '../../../../../libs/utilities/src/lib/auth/checkModelAllowedRoles';
import config from '../../config';
import { Database } from '../../database/database';
import { getUniqueValues } from './../../../../../libs/utilities/src/lib/utilities/arrays/getUniqueValues';

export const readData = async (req: Request, res: Response) => {
	const entityName = req.params.entity;
	if (!entityName) {
		res.send('You must include the resource name to get these entities from!');
		return;
	}

	const model = entityMap[entityName];
	const concreteModel = new model();

	if (model.disableDirectRead) {
		res.status(403).send('You are not allowed to transaction this entity!');
		return;
	}

	let userJwt;
	if (!model.ignoreAuthorization) {
		userJwt = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);
	} else {
		userJwt = {
			username: 'guest'
		};
	}

	if (!checkModelAllowedRoles(model, userJwt)) {
		res.status(403).send('You are not allowed to transaction this entity!');
		return;
	}

	const start = Date.now();

	try {
		let repo = Database._connection.getRepository(entityName);
		let entities = [];
		let findOptions: FindManyOptions = {};
		let cacheTime;
		let distinct = false;
		let distinctProp;
		let useDefaultRepo = false;
		const queries = Object.keys(req.query);

		if (queries && queries.length) {
			let query = {};
			let attrs = [];
			for (let i = 0, len = queries.length; i < len; i++) {
				const key = queries[i];
				const value = <any>req.query[key];

				if (key === 'useDefaultRepo') {
					useDefaultRepo = true;
				} else if (key === 'attrs') {
					attrs = value.split(',');
				} else if (key === 'distinct') {
					distinct = true;
				} else if (key === 'distinctProp') {
					distinctProp = value;
				} else if (key.indexOf('.') >= 0) {
					const splitProp = key.split('.');
					const prop = splitProp[0],
						subProp = splitProp[1];
					query[prop] = {};
					query[prop][subProp] = transformQueryValue(value);
				} else {
					query[key] = transformQueryValue(value);
				}
			}

			findOptions = {};
			if (query) {
				findOptions.where = query;
			}
			if (attrs && attrs.length) {
				findOptions.select = attrs;
			}

			if (cacheTime) {
				findOptions.cache = { id: entityName, milliseconds: cacheTime };
			} else {
				findOptions.cache = false;
			}
		}

		if (model.repoType && !useDefaultRepo) {
			const manager = getManager();
			switch (model.repoType) {
				case 'tree':
					entities = await manager.getTreeRepository(entityName).findTrees();
					break;
				default:
					entities = await repo.find(findOptions);
					break;
			}
		} else {
			entities = await repo.find(findOptions);
		}

		if (concreteModel.postLoad) {
			entities = await concreteModel.postLoad(entities, Database._connection);
		}

		if (model && model.relationships && model.relationships.length) {
			await loadRelationships(entityName, model.relationships, entities);
		}

		removeIgnoredAttrs(entities);

		if (distinct && distinctProp) {
			entities = getUniqueValues(entities, distinctProp)
				.filter((v) => v)
				.sort();
		}

		const end = Date.now();
		logDataTransaction('GET', entityName, entities, userJwt, end - start, req.query);

		res.send(entities);
	} catch (e) {
		res.status(500).send(e);
		const end = Date.now();
		logDataTransactionError(e, 'GET', entityName, userJwt, end - start, req.query);
	}
};

const transformQueryValue = (value: string) => {
	const lowerValue = value.toLowerCase();
	if (lowerValue === 'null') {
		return IsNull();
	} else {
		return value;
	}
};

const removeIgnoredAttrs = (entities: any[]) => {
	if (!entities) return;
	const ignoreAttrs = ['relationships', 'loadAfterSave'];
	(entities instanceof Array ? entities : [entities]).forEach((e) =>
		ignoreAttrs.forEach((attr) => delete e[attr])
	);
};

const loadRelationships = async (
	entityName: string,
	relationships: any[],
	baseEntities: any[],
	ignoreSubRelations?: boolean
) => {
	if (!baseEntities || !baseEntities.length) return;

	const repo = Database._connection.getRepository(entityName);

	// Wait for all sub finds to complete and spread them into a res object
	const { ...res } = await Promise.all(
		relationships.map((relation) => {
			return repo.findByIds(
				baseEntities.map((entity) => {
					if (!entity || !entity.id) return;
					return entity.id;
				}),
				{
					select: ['id'],
					relations: [relation.name]
				}
			);
		})
	);

	// Loop over every sub find result, find the "full entity" we're trying to build from our base entities,
	// and attach the corresponding related entities to it (not a "pure" function)
	const subRelationshipPromises = [];

	for (const i of Object.keys(res)) {
		for (const r of res[i]) {
			const fullEntity = baseEntities.find((e) => e.id === r.id);
			if (fullEntity) {
				const relationName = relationships[i].name;
				const relationModel = relationships[i].model;
				const relationModelName =
					relationModel && relationModel.displayName
						? relationModel.displayName
						: relationships[i].modelName;

				const relationObject = r[relationName];

				if (relationModelName) {
					const subRelationships = entityMap[relationModelName].relationships;

					if (subRelationships && !ignoreSubRelations) {
						subRelationshipPromises.push(
							loadRelationships(
								relationModelName,
								subRelationships,
								relationObject instanceof Array ? relationObject : [relationObject],
								relationships[i].ignoreSubRelations
							)
						);
					}
				}

				removeIgnoredAttrs(relationObject);
				removeIgnoredAttrs(fullEntity);
				fullEntity[relationName] = relationObject;
			}
		}
	}

	await Promise.all(subRelationshipPromises);
};
