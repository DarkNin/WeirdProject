/*
* 提供webstorm等jetbrain工具识别'@'alias字符
* File -> Settings -> Language & Framework -> JavaScript -> Webpack 引用
* */

const resolve = dir => require('path').join(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
};