import { ConnectionOptions } from 'typeorm';

import { entityMap } from './../../../libs/entities/_entity-map';

require('dotenv').config();

export interface ServerConfig {
	isProd?: boolean;

	port?: number;
	portSSL?: number;

	dbOptions?: ConnectionOptions;

	jwtSecret?: string;

	pathToMedia?: string;

	httpsOpts?: {
		key: string;
		cert: string;
		ca: string;
		requestCert: boolean;
		rejectUnauthorized: boolean;
	};
}

const fs = require('fs');

const isProd = process.env.IS_PROD === 'true';

const serverUrl = isProd ? process.env.SERVER_URL : process.env.SERVER_URL_DEV;

const httpPort = isProd ? +process.env.SERVER_PORT_HTTP : +process.env.SERVER_PORT_HTTP_DEV || 1337;
const httpsPort = isProd
	? +process.env.SERVER_PORT_HTTPS
	: +process.env.SERVER_PORT_HTTPS_DEV || 2337;

const certKey = process.env.CERT_KEY_PATH;
const cert = process.env.CERT_PATH;

const pathToEntities = isProd ? './database/entities/**/*.js' : './database/entities/**/*.ts';
const pathToMigrations = isProd ? './database/migrations/**/*.js' : './database/migrations/**/*.ts';
const dbType = isProd ? process.env.DB_TYPE : process.env.DB_TYPE_DEV;
const dbHost = isProd ? process.env.DB_HOST : process.env.DB_HOST_DEV;
const dbPort = isProd ? process.env.DB_PORT : process.env.DB_PORT_DEV;
const dbUsername = isProd ? process.env.DB_USER : process.env.DB_USER_DEV;
const dbPassword = isProd ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV;
const dbDatabase = isProd ? process.env.DB_DATABASE : process.env.DB_DATABASE_DEV || 'gilly';

// const createCertificate = util.promisify(pem.createCertificate);
// const keys = await createCertificate({ days: 1, selfSigned: true });

const config: ServerConfig = {
	isProd: isProd,

	port: httpPort,
	portSSL: httpsPort,

	jwtSecret: process.env.JWT_SECRET || 'CHANGE_ME',

	dbOptions: {
		type: <any>dbType,
		host: dbHost,
		port: +dbPort,
		username: dbUsername,
		password: dbPassword,
		database: dbDatabase,
		synchronize: true,
		logging: isProd ? false : false,
		entities: Object.values(entityMap)
		// cache: true,
		// entities: [path.join(__dirname, pathToEntities)],
		// migrations: [path.join(__dirname, pathToMigrations)],
		// migrationsDir: 'migration'
	},

	pathToMedia: '/public/_media'
};

if (certKey && cert) {
	config['httpsOpts'] = {
		key: fs.readFileSync(__dirname + certKey),
		cert: fs.readFileSync(__dirname + cert),
		ca: fs.readFileSync(__dirname + cert),
		requestCert: true,
		rejectUnauthorized: false
	};
}

export default config;
