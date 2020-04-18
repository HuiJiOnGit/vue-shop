/**
 * roles接口
 */
import * as axios from './http'

/**
 * 角色列表
 */
export function GetRolesList() {
    return axios.get(`roles`)
}

/**
 * 添加角色
 * @param {*} data 
 */
export function AddRoles(data) {
    return axios.post(`roles`,data)
}

/**
 * 根据 ID 查询角色
 * @param {*} id 
 */
export function GetRolesInfo(id) {
    return axios.get(`roles/${id}`)
}

/**
 * 编辑提交角色
 * @param {*} id 
 * @param {*} data 
 */
export function EditRole(id,data) {
    return axios.put(`roles/${id}`,data)
}

/**
 * 删除角色
 * @param {*} id 
 */
export function DelRole(id) {
    return axios.del(`roles/${id}`)
}

/**
 * 角色授权
 * @param {*} id 
 * @param {*} data 
 */
export function AssignRoleRight(id,data) {
    return axios.post(`roles/${id}/rights`,data)
}

/**
 * 删除角色指定权限
 * @param {*} roleId 角色 ID
 * @param {*} rightId 权限 ID
 */
export function DelRoleRight(roleId,rightId) {
    return axios.del(`roles/${roleId}/rights/${rightId}`)
}