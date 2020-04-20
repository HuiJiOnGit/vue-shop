/**
 * 订单管理
 */

import * as axios from './http'

export function Report1() {
    return axios.get(`reports/type/1`)
}