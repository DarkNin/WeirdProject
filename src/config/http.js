import axios from 'axios';
import Qs from 'qs';
import router from '../router';
import {
  alertDanger,
  alertSuccess,
  alertWarning
} from "../utils/modal";
import {closeLoading} from '../utils/loading'
import {urlNeededValidate} from '../config/url'

//过滤器统一对需要用户权限的URL添加信息
axios.interceptors.request.use(
  config => {
    if (urlNeededValidate.includes(config.url)) {
      let configData = Qs.parse(config.data);
      let localUserConfig = JSON.parse(window.localStorage.getItem('info'));
      configData.name = localUserConfig.u;
      configData.password = localUserConfig.p;
      config.data = Qs.stringify(configData);
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
      if (res.data.data === '权限不足！') {
        alertWarning('请检查所用角色或账号密码');
        window.localStorage.removeItem('info');
        window.localStorage.removeItem('isAdmin');
        router.push('/');

      } else {
        alertWarning(res.data.data);
      }
    } else {
      if (res.data.data === '修改成功！') {
        alertSuccess(res.data.data)
      }
      return res
    }
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