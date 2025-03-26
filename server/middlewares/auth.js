// 身份验证中间件
import jwt from 'jsonwebtoken';
import { formatError } from '../utils/index.js';

/**
 * 验证JWT令牌
 */
export const verifyToken = async (ctx, next) => {
  // 从请求头中获取令牌
  const token = ctx.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw formatError('未提供身份验证令牌', 401);
  }
  
  try {
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // 将用户信息添加到上下文状态中
    ctx.state.user = decoded;
    
    await next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // 返回特定的错误码，前端可以据此判断是否需要刷新token
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        code: 'TOKEN_EXPIRED',
        message: '令牌已过期'
      };
      return;
    } else if (error.name === 'JsonWebTokenError') {
      throw formatError('无效的令牌', 401);
    } else {
      throw formatError('身份验证失败', 401);
    }
  }
};