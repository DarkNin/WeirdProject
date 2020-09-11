import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Select, Input, Dialog, Button, Form, FormItem, Checkbox, Menu, MenuItem, Collapse, CollapseItem, Table, TableColumn} from 'element-ui'
import {openLoading, closeLoading} from './utils/loading'
import {alertDanger, alertInfo, alertSuccess, alertWarning} from './utils/modal'
Vue.config.productionTip = false

let compArray = [Select, Input, Dialog, Button, Form, FormItem, Checkbox, Menu, MenuItem, Collapse, CollapseItem, Table, TableColumn];
compArray.forEach(item => {
  Vue.use(item)
})

Vue.prototype.$openLoading = openLoading;
Vue.prototype.$closeLoading = closeLoading;

Vue.prototype.$alertSuccess = alertSuccess;
Vue.prototype.$alertDanger = alertDanger;
Vue.prototype.$alertInfo = alertInfo;
Vue.prototype.$alertWarning = alertWarning;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
