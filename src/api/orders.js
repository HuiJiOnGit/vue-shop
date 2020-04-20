/**
 * 订单管理
 */

import * as axios from './http'

/**
 * 订单数据列表
 * @param {*} data 
 */
export function GetOrderList(data) {
    return axios.get(`orders`,data)
}

/**
 * 修改订单状态
 * @param {*} id 
 * @param {*} data 
 */
export function EditOrder(id,data) {
    return axios.put(`orders/${id}`,data)
}

/**
 * 查看订单详情
 * @param {*} id 
 */
export function GetOrderInfo(id) {
    return axios.get(`orders/${id}`)
}

/**
 *  修改地址
 */
export function EditAddress() {
    return axios.get(`rights/list`)
}

/**
 * 查看物流信息
 * @param {*} id 
 */
export function GetKD(id) {
    return axios.get(`/kuaidi/${id}`)
}
