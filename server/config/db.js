// 数据库配置文件
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,     // 请根据实际情况修改用户名
  password:process.env.DB_PASSWORD,     // 请根据实际情况修改密码
  database: process.env.DB_NAME, // 请确保已创建此数据库
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功!');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}

export { pool, testConnection };