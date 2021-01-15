import { Router } from 'express';

import { UserController } from '../controllers/userController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

const userController = new UserController();

//Get all users
router.get(
	'/',
	[checkJwt, checkRole(['admin', 'superadmin'])],
	userController.listAll.bind(userController)
);

// Get one user
router.get(
	'/:id',
	[checkJwt, checkRole(['admin', 'superadmin'])],
	userController.getOneById.bind(userController)
);

//Create a new user
router.post('/', userController.newUser.bind(userController));

router.post('/:entity', userController.newUser.bind(userController));

//Edit one user
router.patch(
	'/:id',
	[checkJwt, checkRole(['superadmin'])],
	userController.editUser.bind(userController)
);

router.patch(
	'/:id/:entityName',
	[checkJwt, checkRole(['superadmin'])],
	userController.editUser.bind(userController)
);

//Delete one user
router.delete(
	'/:id',
	[checkJwt, checkRole(['superadmin'])],
	userController.deleteUser.bind(userController)
);

router.delete(
	'/:id/:entityName',
	[checkJwt, checkRole(['superadmin'])],
	userController.deleteUser.bind(userController)
);

// Current User
router.get('/me', [checkJwt], userController.getCurrentUser);

export default router;
