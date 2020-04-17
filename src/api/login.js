/**
 * login接口
 */

import axios from 'http'

export const userLogin = (data) => {
    return axios.post(`login`, data);
}



// const article = {    
//     // 新闻列表    
//     articleList () {        
//         return axios.get(`${base.sq}/topics`);    
//     },    
//     // 新闻详情,演示    
//     articleDetail (id, params) {        
//         return axios.get(`${base.sq}/topic/${id}`, {            
//             params: params        
//         });    
//     },
//     // post提交    
//     login (params) {        
//         return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));    
//     }
//     // 其他接口…………
// }