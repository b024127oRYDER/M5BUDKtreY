// 代码生成时间: 2025-09-21 22:14:58
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const ProgressBar = require('progress');

/**
 * 文件备份和同步工具
 * @author Your Name
 * @version 1.0.0
 */
class FileBackupSyncTool {

  /**
   * 构造函数，初始化源目录和目标目录
   * @param {string} sourceDir - 源目录路径
   * @param {string} targetDir - 目标目录路径
   */
  constructor(sourceDir, targetDir) {
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
  }

  /**
   * 同步源目录到目标目录
   * @param {boolean} force - 是否强制覆盖
   */
  sync(sourceDir, targetDir, force = false) {
    try {
      // 确保源目录和目标目录存在
      fs.ensureDirSync(sourceDir);
      fs.ensureDirSync(targetDir);

      // 获取源目录和目标目录中的文件列表
      const sourceFiles = fs.readdirSync(sourceDir);
      const targetFiles = fs.readdirSync(targetDir);

      // 遍历源目录中的文件
      sourceFiles.forEach((file) => {
        const sourceFilePath = path.join(sourceDir, file);
        const targetFilePath = path.join(targetDir, file);

        // 如果目标目录中不存在该文件，则复制
        if (!targetFiles.includes(file)) {
          fs.copyFileSync(sourceFilePath, targetFilePath);
          console.log(`文件 ${file} 已同步到目标目录。`);
        } else if (force) {
          // 如果强制覆盖，则删除目标目录中的文件并复制
          fs.removeSync(targetFilePath);
          fs.copyFileSync(sourceFilePath, targetFilePath);
          console.log(`文件 ${file} 已强制覆盖到目标目录。`);
        } else {
          // 如果不强制覆盖，则跳过
          console.log(`文件 ${file} 已存在于目标目录，跳过。`);
        }
      });

      // 遍历目标目录中的文件，如果源目录中不存在，则删除
      targetFiles.forEach((file) => {
        const sourceFilePath = path.join(sourceDir, file);
        const targetFilePath = path.join(targetDir, file);

        if (!sourceFiles.includes(file)) {
          fs.removeSync(targetFilePath);
          console.log(`文件 ${file} 已从目标目录中删除。`);
        }
      });

      console.log('同步完成。');
    } catch (error) {
      console.error('同步失败:', error.message);
    }
  }

  /**
   * 备份源目录到目标目录
   */
  backup() {
    try {
      // 确保源目录和目标目录存在
      fs.ensureDirSync(this.sourceDir);
      fs.ensureDirSync(this.targetDir);

      // 复制整个源目录到目标目录
      fs.copySync(this.sourceDir, this.targetDir, { overwrite: true });
      console.log('备份完成。');
    } catch (error) {
      console.error('备份失败:', error.message);
    }
  }
}

// 示例用法
const tool = new FileBackupSyncTool('/path/to/source', '/path/to/target');
tool.sync('/path/to/source', '/path/to/target', true); // 强制同步
tool.backup(); // 备份源目录
