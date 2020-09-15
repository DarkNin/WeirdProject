const MockConfig = require('./mock.config');
module.exports = {
    productionSourceMap: false,
    devServer: {
        before: function (app, server, complier) {
            MockConfig.interfaceList.forEach(item => {
                app.all(item.url, function (req, res) {
                    setTimeout(() => {
                        res.json(item.response)
                    }, 500)
                })
            })
        }
    }
}