/**
 * rights接口
 */

import * as axios from './http'

/**
 * 左侧菜单权限
 * @param {*} data 
 */
export function getMeuns(data) {
    return axios.get(`menus`);
}

/**
 * 获取权限列表
 */
export function GetRightsList() {
    return axios.get(`rights/list`)
}

/**
 * 获取权限树
 */
export function GetRightsTree() {
    return axios.get(`rights/tree`)
}