// 代码生成时间: 2025-09-17 05:27:51
const { Pool } = require('pg'); // 使用pg模块连接PostgreSQL数据库

// 配置数据库连接池
const poolConfig = {
  user: 'your_username', // 数据库用户名
  host: 'your_host', // 数据库主机地址
  database: 'your_database', // 数据库名称
  password: 'your_password', // 数据库密码
  port: 5432, // 端口号
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 连接超时时间
  connectionTimeoutMillis: 2000 // 连接创建超时时间
};

// 创建数据库连接池
const pool = new Pool(poolConfig);

class DatabasePoolManager {
  // 获取数据库连接
  static async getConnection() {
    try {
      // 尝试从连接池中获取一个连接
      const client = await pool.connect();
      console.log('Connection established.');
      return client;
    } catch (error) {
      // 错误处理
      console.error('Failed to establish a connection:', error.message);
      throw error;
    }
  }

  // 执行SQL查询
  static async query(sql) {
    let result;
    try {
      // 获取连接
      const client = await DatabasePoolManager.getConnection();
      // 执行查询
      result = await client.query(sql);
      // 释放连接
      client.release();
      console.log('Query executed successfully.');
      return result;
    } catch (error) {
      // 错误处理
      console.error('Query failed:', error.message);
      if (client) {
        client.release(); // 即使发生错误也要释放连接
      }
      throw error;
    }
  }

  // 释放所有连接池资源
  static async end() {
    try {
      await pool.end();
      console.log('All connections in the pool have been terminated.');
    } catch (error) {
      console.error('Failed to end the pool:', error.message);
    }
  }
}

// 导出DatabasePoolManager类
module.exports = DatabasePoolManager;