import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import { DataController } from '../controllers/dataController';
import config from '../config';

const router = Router();

const dataController = new DataController();

router.get(
	'/:entity',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.get
);

router.post(
	'/:entity',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.create.bind(dataController)
);

router.patch(
	'/:entity/:id',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.update.bind(dataController)
);

router.put(
	'/:entity/:id',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.update.bind(dataController)
);

router.put(
	'/:entity',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.update.bind(dataController)
);

router.delete(
	'/:entity/:id',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.delete.bind(dataController)
);

router.delete(
	'/:entity',
	[checkJwt, checkRole(['superadmin', 'admin', 'user'])],
	dataController.delete.bind(dataController)
);

export default router;
