import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.userZodSchema),
  AuthController.userRegister
);

router.post('/login', validateRequest(AuthValidation.loginZodSchema), AuthController.userLogin);

router.get('/user', auth, AuthController.getUser);

export const AuthRoutes = router;
