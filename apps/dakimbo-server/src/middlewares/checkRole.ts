import { NextFunction, Request, Response } from 'express';

import { entityMap } from './../../../../libs/entities/_entity-map';
import { checkUserRole } from './../../../../libs/utilities/src/lib/auth/checkUserRole';

export const checkRole = (roles: Array<string>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Check if the requested entity doesn't need authorization
		const entityName = req.params.entity;
		const model = entityMap[entityName];
		if (!model || model.ignoreAuthorization) {
			next();
			return;
		}

		// Get the user from middleware
		const user = res.locals.jwtPayload;

		// Check if array of authorized roles includes the user's role
		if (checkUserRole(user, roles)) next();
		else res.status(401).send();
	};
};
