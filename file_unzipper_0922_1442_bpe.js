// 代码生成时间: 2025-09-22 14:42:48
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const EventEmitter = require('events');

// 事件发射器，用于处理压缩和解压事件
class FileUnzipper extends EventEmitter {}
const fileUnzipper = new FileUnzipper();

// 创建压缩文件
function createZip(inputPath, outputPath, callback) {
  fs.ensureDirSync(path.dirname(outputPath));
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outputPath);

  stream.on('close', function () {
    console.log(`Archive created at ${outputPath} with ${archive.pointer()} bytes`);
    if (callback) callback();
  });

  archive.on('error', function (err) {
    throw err;
  });
  
  archive.pipe(stream);
  
  if (Array.isArray(inputPath)) {
    inputPath.forEach((file) => {
      archive.file(file, { name: path.basename(file) });
    });
  } else {
    archive.directory(inputPath, false);
  }
  
  archive.finalize();
}

// 解压压缩文件
function unzipFile(inputPath, outputPath, callback) {
  fs.ensureDirSync(outputPath);

  const readStream = fs.createReadStream(inputPath);
  const extract = archiver('zip', { zlib: { level: 9 } });
  const writeStream = fs.createWriteStream(path.join(outputPath, path.basename(inputPath, '.zip')));
  const dir = path.join(outputPath, path.basename(inputPath, '.zip'));

  readStream.on('error', function (err) {
    console.error('An error occurred while reading the zip file', err);
    if (callback) callback(err);
  });

  extract.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  extract.on('error', function (err) {
    throw err;
  });

  extract.pipe(writeStream);

  readStream.pipe(extract);
  readStream.on('close', function () {
    fs.moveSync(writeStream.path, dir, { overwrite: true });
    console.log(`Unzipped ${inputPath} to ${dir}`);
    if (callback) callback(null, dir);
  });
}

// 导出FileUnzipper类
module.exports = {
  FileUnzipper,
  createZip,
  unzipFile
};