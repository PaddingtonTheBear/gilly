import { Request, Response } from 'express';

const os = require('os');
const mkdirp = require('mkdirp');

export class MediaController {
	async uploadMedia(req: Request, res: Response) {
		// const entityName = req.params.entity;
		// const entityId = req.params.id;
		// let userJwt;
		// if (entityName) {
		// 	const model = entityMap[entityName];
		// 	if (!model.ignoreAuthorization) {
		// 		userJwt = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);
		// 	} else {
		// 		userJwt = {
		// 			username: 'guest'
		// 		};
		// 	}
		// }
		// const media = (<any>req).files.media;
		// let mediaFiles = [];
		// if (!media.length) {
		// 	mediaFiles = [media];
		// } else {
		// 	mediaFiles = media;
		// }
		// const mediaMap = {};
		// mediaFiles.forEach(async (f: File | any) => {
		// 	let directoryPath = `${__dirname}${config.pathToMedia}${
		// 		entityName ? '/' + entityName.toLowerCase() : ''
		// 	}${entityId ? '/' + entityId : ''}`;
		// 	let mediaPath = `${directoryPath}/${f.name}`;
		// 	if (os.platform() === 'win32') {
		// 		directoryPath = directoryPath.replace('/', '\\');
		// 		mediaPath = mediaPath.replace('/', '\\');
		// 	}
		// 	directoryPath = path.resolve(directoryPath);
		// 	mediaPath = path.resolve(mediaPath);
		// 	await mkdirp(directoryPath, { recursive: true });
		// 	f.mv(mediaPath, (error) => {
		// 		if (error) {
		// 			console.error(error);
		// 			res.writeHead(500, { 'Content-Type': 'application/json' });
		// 			return;
		// 		}
		// 	});
		// 	mediaMap[mediaPath] = f;
		// });
		// const mediaMeta = await this.handleEntityMediaUpload(
		// 	mediaMap,
		// 	entityName,
		// 	entityId,
		// 	userJwt
		// );
		// res.status(201).send(mediaMeta);
	}

	handleGeneralMediaUpload() {}

	// async handleEntityMediaUpload(
	// 	media: { [path: string]: File },
	// 	entityName: string,
	// 	entityId?: string,
	// 	userJwt?: { username: string }
	// ) {
	// 	let fullEntity: FormBaseModel;
	// 	try {
	// 		fullEntity = <FormBaseModel>await getRepository(entityName).findOneOrFail(entityId);
	// 	} catch (e) {
	// 		// couldn't find, need to create one
	// 		fullEntity = <FormBaseModel>await getRepository(entityName).save({});
	// 	}

	// 	let mediaEntities: FormMedia[] = [];
	// 	Object.keys(media).forEach((path) => {
	// 		const file = media[path];

	// 		const existingMediaEntity = fullEntity.formEntity?.media.find(
	// 			(m: FormMedia) => m.fileName === file.name
	// 		);
	// 		if (existingMediaEntity && !existingMediaEntity.deprecated) return; // no duplicates

	// 		let extension;
	// 		try {
	// 			extension = file.name.split('.')[1];
	// 		} catch (e) {
	// 			extension = '';
	// 		}

	// 		mediaEntities.push(
	// 			new FormMedia({
	// 				mediaName: file.name.split('.')[0],
	// 				fileName: file.name,
	// 				extension: extension,
	// 				size: file.size,
	// 				sizeFormatted: convertByteToHuman(file.size),
	// 				type: file.type,
	// 				description: '',
	// 				category: '',
	// 				url: `${config.serverUrl}${path.split('public')[1]}`,
	// 				thumbnail: '',
	// 				relativePath: path.split('public')[1],
	// 				entityName: entityName,
	// 				formEntity: fullEntity.formEntity,
	// 				createUser: userJwt?.username,
	// 				modifyUser: userJwt?.username
	// 			})
	// 		);
	// 	});

	// 	const start = Date.now();

	// 	if (mediaEntities.length)
	// 		mediaEntities = await getRepository('FormMedia').save(mediaEntities);

	// 	const end = Date.now();
	// 	logDataTransaction('POST', 'FormMedia', mediaEntities, userJwt, end - start);

	// 	return { media: mediaEntities, entity: fullEntity };
	// }

	// async saveMediaMeta(req: Request, res: Response) {
	// 	const mediaEntity = req.body;
	// 	const mediaRepo = getRepository('FormMedia');

	// 	const start = Date.now();

	// 	let userJwt;
	// 	try {
	// 		userJwt = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);
	// 	} catch (e) {
	// 		userJwt = {
	// 			username: 'guest'
	// 		};
	// 	}

	// 	try {
	// 		let savedMedia = await mediaRepo.save(mediaEntity);
	// 		const end = Date.now();
	// 		logDataTransaction(<any>req.method, 'FormMedia', mediaEntity, userJwt, end - start);
	// 		res.send(savedMedia);
	// 	} catch (e) {
	// 		const end = Date.now();
	// 		logDataTransactionError(e, <any>req.method, 'FormMedia', userJwt, end - start);
	// 		res.status(500).send(e);
	// 	}
	// }

	// async deleteMedia(req: Request, res: Response) {
	// 	const mediaId = req.params.mediaId;
	// 	const mediaRepo = getRepository('FormMedia');
	// 	let mediaEntity;
	// 	try {
	// 		mediaEntity = <FormMedia>await mediaRepo.findOneOrFail(mediaId);
	// 	} catch (error) {
	// 		console.error(`Couldn't find media for id: ${mediaId}`);
	// 		res.status(500).send(`ERROR: Couldn't find media id, ${mediaId}, to deprecate!`);
	// 		return;
	// 	}

	// 	let userJwt;
	// 	try {
	// 		userJwt = <any>jwt.verify(<string>res.getHeader('token'), config.jwtSecret);
	// 	} catch (e) {
	// 		userJwt = {
	// 			username: 'guest'
	// 		};
	// 	}

	// 	// Simply deprecate the media, don't actually delete it
	// 	mediaEntity.deprecated = true;

	// 	const start = Date.now();
	// 	try {
	// 		mediaEntity = await mediaRepo.save(mediaEntity);
	// 		const end = Date.now();
	// 		logDataTransaction(<any>req.method, 'FormMedia', mediaEntity, userJwt, end - start);
	// 		res.status(201).send(mediaEntity);
	// 	} catch (e) {
	// 		res.status(500).send(e);
	// 	}
	// }
}
