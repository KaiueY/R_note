// 用户相关路由
import Router from 'koa-router';
import * as userController from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';

const router = new Router({ prefix: '/api/user' });

// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);

// 需要身份验证的路由
router.get('/info', verifyToken, userController.getUserInfo);
router.post('/update', verifyToken, userController.updateUserInfo);
router.get('/settings', verifyToken, userController.getUserSettings);
router.post('/settings/update', verifyToken, userController.updateUserSettings);
router.get('/stats', verifyToken, userController.getUserStats);
router.post('/logout', verifyToken, userController.logout);

export default router;