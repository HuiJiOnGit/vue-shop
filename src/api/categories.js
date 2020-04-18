/**
 * categories接口
 */
import * as axios from './http'

/**
 * 商品分类数据列表
 * @param {*} data 
 */
export function GetCateList(data) {
    return axios.get(`categories`,data)
}
/**
 * 添加分类
 * @param {*} data 
 */
export function AddCate(data) {
    return axios.post(`categories`,data)
}
/**
 * 根据 id 查询分类
 * @param {*} id 
 */
export function GetCateInfo(id) {
    return axios.get(`categories/${id}`)
}
/**
 * 编辑提交分类
 * @param {*} id 
 * @param {*} data 
 */
export function EditCate(id,data) {
    return axios.put(`categories/${id}`,data)
}
/**
 * 删除分类
 * @param {*} id 
 */
export function DelCate(id) {
    return axios.del(`categories/${id}`)
}
/**
 * 参数列表
 * @param {*} id 
 * @param {*} data 
 */
export function GetCateAttrList(id,data) {
    return axios.get(`categories/${id}/attributes`,data)
}
/**
 * 添加动态参数或者静态属性
 * @param {*} id 
 * @param {*} data 
 */
export function AddCateAttr(id,data) {
    return axios.post(`categories/${id}/attributes`,data)
}
/**
 * 删除参数
 * @param {*} id 
 * @param {*} attrid 
 */
export function DelCateAttr(id,attrid) {
    return axios.del(`categories/${id}/attributes/${attrid}`)
}
/**
 * 根据 ID 查询参数
 * @param {*} id 
 * @param {*} attrid 
 */
export function GetCateAttrInfo(id,attrid) {
    return axios.get(`categories/${id}/attributes/${attrid}`)
}
/**
 * 编辑提交参数
 * @param {*} id 
 * @param {*} attrid 
 * @param {*} data 
 */
export function EditCateAttr(id,attrid,data) {
    return axios.put(`categories/${id}/attributes/${attrid}`,data)
}