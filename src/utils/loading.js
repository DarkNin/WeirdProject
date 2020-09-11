import {Loading} from 'element-ui'
import Bus from './eventBus'

let loading;

export const openLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.1)'
  })
};

export const closeLoading = () => {
  Bus.$nextTick(() => {
    if (loading) {
      loading.close()
    }
  })
};
