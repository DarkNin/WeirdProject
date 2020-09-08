import axios from 'axios';
import Qs from 'qs';
import router from '../router';
import {alertDanger, alertWarning} from "../utils/modal";

axios.interceptors.request.use(
  config => {
    console.log(config)
    return config;
  },
  error => {
    return Promise.reject(error)
  }
);


axios.interceptors.response.use(
  res => {
    if (res.data.code === 500){
      if(res.data.data === '权限不足！'){
        alertWarning('请检查所用角色或账号密码');
        window.localStorage.removeItem('info');
        window.localStorage.removeItem('isAdmin');
        router.push('/');

      }
    }
    return res
  },
  error => {
    if (error.response) {
      console.log(JSON.stringify(error))
    }
    return Promise.reject(JSON.stringify(error))
  }
);

export default axios;
