import { Router } from 'express';

import { AuthController } from '../controllers/authController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

const authController = new AuthController();

//Login route
router.post('/login', authController.login.bind(authController));

router.post('/login/:entity', authController.login.bind(authController));

router.post('/login-cert', authController.loginCertificate.bind(authController));

//Change my password
router.post('/change-password', [checkJwt], authController.changePassword.bind(authController));

export default router;
