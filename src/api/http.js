// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import router from '../router';
//import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
// vant的toast提示框组件，大家可根据自己的ui组件更改。
// 导入nprogress包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {
    Message
} from 'element-ui';

/*
我们的项目环境可能有开发环境、测试环境和生产环境。
我们通过node的环境变量来匹配我们的默认的接口url前缀。
axios.defaults.baseURL可以设置axios的默认请求地址就不多说了。
*/
// 环境的切换
// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = 'https://www.baidu.com';} 
// else if (process.env.NODE_ENV == 'debug') {    
//     axios.defaults.baseURL = 'https://www.ceshi.com';
// } 
// else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = 'https://www.production.com';
// }

// 设置baseurl
// axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1'
// axios.defaults.baseURL ='http://47.115.124.102:8888/api/private/v1'
// axios.defaults.baseURL ='http://119.23.53.78:8888/api/private/v1'
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'

// 请求超时时间
axios.defaults.timeout = 10000;
// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * 
 * @param {string} msg 提示内容
 */
const Msg = msg => {
    Message({
        message: msg,
        type: 'error',
        duration: 1000
    });
}

/**
 * 跳转到登录界面
 */
const toLogin = () => {
    router.replace({
        path: '/login'
    });
}

/**
 * 
 * @param {Number} status 状态码
 * @param {*} other 其他
 */
const errorHandle = (status, other) => {
    switch (status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        case 401:
            toLogin();
            break;

            // 403 token过期
            // 登录过期对用户进行提示
            // 清除本地token和清空vuex中token对象
            // 跳转登录页面                
        case 403:
            Msg('登录过期，请重新登录')
            // 清除token
            window.sessionStorage.clear()
            // store.commit('loginSuccess', null);
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;

            // 404请求不存在
        case 404:
            Msg('网络请求不存在');
            break;
            // 其他错误，直接抛出错误提示
        default:
            console.error(other);
    }
}

// 请求拦截
// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
// import store from '@/store/index';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断vuex中是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        // const token = store.state.token;        
        // token && (config.headers.Authorization = token);        
        // return config;

        // (可以使用vuex，但是这里我直接在sessionStore里面判断有没有token就行了)
        // console.log(config);
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config;

    },
    error => {
        return Promise.error(error);
})

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        // console.log(response);
        NProgress.done()
        if (response.data.meta.status === 200 || response.data.meta.status === 201) {
            return Promise.resolve(response.data);
        } else {
            return Promise.reject(response.data);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        errorHandle(error.meta.status, error.meta.msg);
        return Promise.reject(error.response);
    });

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params = {}){  
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        })        
        .then(res => {            
            resolve(res);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} data [请求时携带的参数] 
 */
export function post(url, data = {}) {    
    return new Promise((resolve, reject) => {         
        axios.post(url, data)        
        .then(res => {
            console.log(res);
            resolve(res);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
    // return axios.post(url, data);
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url]
 * @param {object} data [请求参数]
 */
export function put(url,data = {}) {
	return new Promise((resolve,reject) => {
		axios.put(url,data)
		.then(res => {
			resolve(res);
		})
		.catch(err => {
			reject(err)
		})
	})
}

/**
 * put方法，对应delete请求
 * @param {String} url [请求的url]
 */
export function del(url) {
	return new Promise((resolve,reject) => {
		axios.delete(url)
		.then(res => {
			resolve(res);
		})
		.catch(err => {
			reject(err)
		})
	})
}