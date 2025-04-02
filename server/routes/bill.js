// 账单相关路由
import Router from 'koa-router';
import * as billController from '../controllers/bill.js';
import { verifyToken } from '../middlewares/auth.js';

const router = new Router({ prefix: '/bill' });

// 所有账单路由都需要身份验证
router.get('/', verifyToken, billController.getBills);
router.post('/add', verifyToken, billController.addBill);
router.post('/update', verifyToken, billController.updateBill);
router.post('/delete', verifyToken, billController.deleteBill);
router.get('/types', verifyToken, billController.getBillTypes);
router.get('/cards', verifyToken, billController.getCards);

export default router;