import Qs from 'qs'
import axios from '@/config/http'

export const axiosFetch = (opt) =>{
  return axios({
    method: 'post',
    url: opt.url,
    timeout: 90000,
    headers: {
      'Content-type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: Qs.stringify(opt.data)
  })
};




