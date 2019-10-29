/*2019-3-19 by 蔡先佳*/
/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */


import axios from 'axios';
import QS from 'qs';
import Env from './env'
import Storage from '../util/storage';
import NProgress from 'nprogress';
// import store from '../store/index'
import router from '../router/index'
// // import {LOGOUT} from "../store/mutation_type";
// // import store from '../store/index'

let token = Storage.getSession('access_token');
// let token =null;
// // 请求超时时间
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = 'http://39.98.200.121:8092'
// // post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

// // 请求拦截器
axios.interceptors.request.use(

  config => {
    NProgress.start();
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    
    let url=config.url;
    if(url.indexOf('deleteDept')!=-1){
      config.headers.post['Content-Type'] = 'application/json';
    }
    if(url.indexOf('saveDept')!=-1){
      config.headers.post['Content-Type'] = 'application/json';
    }
    if(url.indexOf('oauth')!=-1){
      // 如果是登录/注销
      config.headers.Authorization = 'Basic aW90LWNsaWVudDp3YW53dWh1bGlhbg=='
    }
    return config;
  },
  error => {
    return Promise.error(error);
  });
// // 响应拦截器
axios.interceptors.response.use(
  response => {
    NProgress.done()
    if (response.status === 200) {
      if(!token){
        Storage.setSession("access_token",response.data.access_token);
      }
      token = Storage.getSession('access_token');
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    // 请求结束，蓝色过渡滚动条消失
    // 即使出现异常，也要调用关闭方法，否则一直处于加载状态很奇怪
    // NProgress.done();
    console.log(error.response.data.error)
    
    if(error.response.data.error){
      NProgress.done();
      return Promise.reject(error.response);
    }
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。

        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          // console.log()
          return;
          // Storage.clearAllSession()
          // 401 清除token信息并跳转到登录页面
          // store.commit(LOGOUT)
          // alert('未登录')
          break;
          
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          // 清除token
          // alert('登录过期，请重新登录')
          // localStorage.removeItem('token');
          // store.commit('loginSuccess', null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            alert('登录过期')
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;
        // 404请求不存在
        case 404:
          alert('网络请求不存在')

          break;
        // 其他错误，直接抛出错误提示
        default:
          console.log('其他错误')
        // alert('有其他错误')
      }
      return Promise.reject(error.response);
    }
  }
);
//  token =Storage.getSession('access_token')
 //基地址
let base = Env.baseURL;
console.log(token)
// const token = Storage.getSession("access_token");
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(base+url+'?access_token='+Storage.getSession('access_token'), {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function dele(url, params) {
  return new Promise((resolve, reject) => {
    let data={access_token:Storage.getSession('access_token')};
    axios({
      method:'delete',
      url:base+url,
      data:data
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/**
 * post方法，对应post请求
 * 
 * 
 */
export function jsonPost(url, params) {
  
  return new Promise((resolve, reject) => {
      axios({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        url:  base+url+'?access_token='+Storage.getSession('access_token'),
        data: params
        // data: JSON.stringify(params)
      }).then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function PPost(url, params) {
  return new Promise((resolve, reject) => {
      axios({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        url:  base+url+'?access_token='+Storage.getSession('access_token'),
        params:  params
      }).then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function PostStr(url, params) {
  return new Promise((resolve, reject) => {
      axios({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        url:  base+url+'?access_token='+Storage.getSession('access_token'),
        data: JSON.stringify(params) 
      }).then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * post方法，对应post请求
 * 
 * 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    if(url.indexOf('oauth')==-1){
      url=url+'?access_token='+Storage.getSession('access_token');
    }
      axios({
        method: 'post',
        url:  base+url,
        data: QS.stringify(params)
      }).then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/**
 * post方法，对应post请求---params方式
 * 
 * 
 */
export function paramsPost(url, params) {
  
  // console.log(token)
  return new Promise((resolve, reject) => {
    if(url.indexOf('oauth')==-1){
      url=url+'?access_token='+Storage.getSession('access_token');
    }
    axios.post(base+url, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function deletePost(url, params) {
  return new Promise((resolve, reject) => {
    let data1 = new URLSearchParams()
    data1.append('access_token', Storage.getSession('access_token'))
    data1.append('deptId', params.deptId)
    axios({
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'post',
      url:  base+url+"?"+data1
    }).then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err.data)
    })
  });
}
