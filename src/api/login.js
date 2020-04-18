/**
 * login接口
 */

import * as axios from './http'


export function userLogin(data) {
    return axios.post(`login`, data);
}