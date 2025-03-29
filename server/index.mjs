import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import userRoutes from './routes/user.js';
import billRoutes from './routes/bill.js';

// 加载环境变量
dotenv.config();

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建Koa应用实例
const app = new Koa();
const router = new Router();

// 配置中间件
app.use(bodyParser());
app.use(cors(
  {
    origin: '*', // 允许所有域名跨域
    credentials: true, // 允许携带cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 允许的请求头
    exposeHeaders:['Authorization']
  }
));
console.log('process.env.DB_HOST:', process.env.DB_HOST);

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Server Error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      status: 'error',
      message: err.message || 'Internal Server Error'
    };
  }
});

// 基础路由
router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'MyNote API Server is running'
  };
});

// 测试路由
router.get('/test', async (ctx) => {
  ctx.body = {
    status: 'success',
    data: {
      message: 'API test successful',
      timestamp: new Date()
    }
  };
});

// 测试数据库连接
testConnection().then(connected => {
  if (!connected) {
    console.error('数据库连接失败，请检查配置');
    process.exit(1);
  }
  console.log('数据库连接成功');
});

// 集成路由
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(billRoutes.routes()).use(billRoutes.allowedMethods());

// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});