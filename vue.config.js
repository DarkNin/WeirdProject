const MockConfig = require('./mock.config');
module.exports = {
  publicPath: '/weird/',
  productionSourceMap: false,
  runtimeCompiler: false,
  devServer: {
    // before: function (app, server, complier) {
    //     MockConfig.interfaceList.forEach(item => {
    //         app.all(item.url, function (req, res) {
    //             setTimeout(() => {
    //                 res.json(item.response)
    //             }, 500)
    //         })
    //     })
    // }
    proxy: 'http://ikataomoi.com:15163'
  },

  chainWebpack(config) {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('svg-sprite-loader').loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  }
}