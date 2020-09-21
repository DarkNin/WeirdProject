import Qs from 'qs'
import axios from '@/config/http'

export const axiosFetch = (opt) => {
  return axios({
    method: 'post',
    url: opt.url,
    timeout: 90000,
    headers: {
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: Qs.stringify(opt.data)
  })
};

export const axiosGet = opt => {
  return axios({
    method: 'get',
    url: opt.url,
    timeout: 90000,
    params: opt.data
  })
};

export const axiosPostAsJSON = (opt) => {
  return axios({
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'post',
    url: opt.url,
    timeout: 90000,
    data: opt.data
  })
};