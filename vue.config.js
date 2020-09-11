const MockConfig = require('./mock.config');
module.exports = {
    productionSourceMap: false,
    devServer: {
        before: function (app, server, complier) {
            const serverPath = '/weird_project'
            MockConfig.interfaceList.forEach(item => {
                app.all(serverPath + item.url, function(req, res) {
                    res.json(item.response)
                })
            })
        }
    }
}