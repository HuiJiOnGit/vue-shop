/**
 * user接口
 */
import * as axios from './http'

/**
 * 用户数据列表
 * @param {*} data 
 */
export function GetUserList(data) {
    return axios.get(`users`, data)
}

/**
 * 修改用户状态
 * @param {number} uId 用户 ID
 * @param {bool} type 用户状态
 */
export function ChangeUserStatus(uId,type) {
    return axios.put(`users/${uId}/state/${type}`)
}

/**
 * 根据ID查询用户信息
 * @param {number} id 用户 ID
 */
export function GetUserInfo(id) {
    return axios.get(`users/${id}`)
}

/**
 * 添加用户
 * @param {*} data 
 */
export function AddUser(data) {
    return axios.post(`users`,data)
}

/**
 * 编辑用户提交
 * @param {*} id 用户 id
 * @param {*} data 
 */
export function EditUser(id,data) {
    return axios.put(`users/${id}`,data)
}

/**
 * 删除单个用户
 * @param {*} id 用户 id
 */
export function DelUser(id) {
    return axios.del(`users/${id}`)
}

/**
 * 分配用户角色
 * @param {*} id 用户 ID
 * @param {*} rid 角色 id
 */
export function AssignRoles(id,rid) {
    return axios.put(`users/${id}/role`,rid)
}