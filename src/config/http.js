import axios from 'axios';
import Qs from 'qs';
import router from '../router';
import {
  alertDanger,
  alertSuccess,
  alertWarning
} from "../utils/modal";
import {
  closeLoading
} from '../utils/loading'
import {
  urlNeededValidate
} from '../config/url'

//过滤器统一对需要用户权限的URL添加信息
axios.interceptors.request.use(
  config => {
    if (urlNeededValidate.includes(config.url)) {
      let localUserConfig = JSON.parse(window.localStorage.getItem('info'));
      if (config.method === 'post' && config.headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
        let configData = Qs.parse(config.data);
        configData.name = localUserConfig.u;
        configData.password = localUserConfig.p;
        config.data = Qs.stringify(configData);
      } else if(config.method === 'post' && config.headers['Content-Type'].includes('application/json')) {
        config.data.name = localUserConfig.u;
        config.data.password = localUserConfig.p;
      } else if (config.method === 'get') {
        config.params.name = localUserConfig.u;
        config.params.password = localUserConfig.p;
      }

    }
    return config;
  },
  error => {
    return Promise.reject(error)
  }
);


axios.interceptors.response.use(
  res => {
    if (res.data.code === 500) {
      closeLoading();
      if (res.data.data === '权限不足！') {
        alertWarning('请检查所用角色或账号密码');
        window.localStorage.removeItem('info');
        window.localStorage.removeItem('isAdmin');
        router.push('/');

      } else {
        alertWarning(res.data.data);
      }
    } else {
      if (typeof res.data.data === 'string' && res.data.data.includes('成功')) {
        alertSuccess(res.data.data)
      }
    }
    return res
  },
  error => {
    if (error.response) {
      console.log(JSON.stringify(error));
      alertDanger(error.message);
      closeLoading();

    }
    return Promise.reject(error)
  }
);

export default axios;