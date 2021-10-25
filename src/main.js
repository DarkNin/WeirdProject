import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Input, Dialog, Button, Form, FormItem, Checkbox, Menu, MenuItem, Collapse, CollapseItem, Table, TableColumn, Pagination, Select, Option, Autocomplete, Dropdown, DropdownMenu, DropdownItem, Tag, DatePicker, Image, Upload, ColorPicker} from 'element-ui'
import {openLoading, closeLoading} from './utils/loading'
import {alertDanger, alertInfo, alertSuccess, alertWarning} from './utils/modal'
import Darkmode from 'darkmode-js'
import '@/components/svg/index'

Vue.config.productionTip = false

let compArray = [Input, Dialog, Button, Form, FormItem, Checkbox, Menu, MenuItem, Collapse, CollapseItem, Table, TableColumn, Pagination, Select, Option, Autocomplete, Dropdown, DropdownMenu, DropdownItem, Tag, DatePicker, Image, Upload, ColorPicker];
compArray.forEach(item => {
  Vue.use(item)
})

Vue.prototype.$openLoading = openLoading;
Vue.prototype.$closeLoading = closeLoading;

Vue.prototype.$alertSuccess = alertSuccess;
Vue.prototype.$alertDanger = alertDanger;
Vue.prototype.$alertInfo = alertInfo;
Vue.prototype.$alertWarning = alertWarning;


const options = {
  top: '10px', // default: '32px'
  right: '10px', // default: '32px'
  left: 'unset',
  bottom: 'unset',
  time: '0', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#eee url("./imgs/background.jpg")',  // default: '#fff'
  buttonColorDark: 'transparent',  // default: '#100f2c'
  buttonColorLight: 'transparent', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: false // default: true
}

const darkmode = new Darkmode(options);
darkmode.showWidget();
Vue.prototype.$darkmode = darkmode;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
