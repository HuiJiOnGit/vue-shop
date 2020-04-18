/**
 * goods接口
 */
import * as axios from './http'

/**
 * 商品列表数据
 * @param {*} data 
 */
export function GetGoodsList(data) {
    return axios.get(`goods`,data)
}
/**
 * 添加商品
 * @param {*} data 
 */
export function AddGood(data) {
    return axios.post(`goods`,data)
}
/**
 * 根据 ID 查询商品
 * @param {*} id 
 */
export function GetGoodsInfo(id) {
    return axios.get(`goods/${id}`,data)
}
/**
 * 编辑提交商品
 * @param {*} id 
 * @param {*} data 
 */
export function EditGood(id,data) {
    return axios.put(`goods/${id}`,data)
}
/**
 * 同步商品图片
 * @param {*} id 
 * @param {*} data 
 */
export function EditGoodAndPic(id,data) {
    return axios.put(`goods/${id}/pics`,data)
}
/**
 * 同步商品属性
 * @param {*} id 
 * @param {*} data 
 */
export function EditGoodAndAttr(id,data) {
    return axios.put(`goods/${id}/attributes`,data)
}
/**
 * 删除商品
 * @param {*} id 
 */
export function DelGood(id) {
    return axios.del(`goods/${id}`)
}