<template>
    <div>
        <!-- 面包屑部分 -->
        <bread title1='权限管理' title2='角色列表'></bread>
        <!-- 卡片 -->
        <el-card>
            <el-row>
                <el-col :span="1">
                    <el-button type="primary" @click="AddRole">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="rolelist" border stripe>

                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot:default="scope">
                        <el-row :class="['bdbottom', key === 0 ? 'bdtop' : '','vcenter']"
                            v-for="(item, key) in scope.row.children" :key="item.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二三级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2 , key2) in item.children" :key="item2.id"
                                    :class="[key2 === 0 ? '' : 'bdtop','vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3 ,key3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>

                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot:default="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="EditRole(scope.row.id)">编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 对话框 -->
            <role-dialog @updateRolesList="getRolesList"></role-dialog>

            <!-- 权限对话框 -->
            <el-dialog title="分配权限" 
                       :visible.sync="rightDialogVisible" 
                       width="30%"
                       @close="setRightDialogClosed" >
                <!-- 树形控件 -->
                <el-tree :data="rightsList" 
                         :props="defaultProps" 
                         show-checkbox node-key="id" 
                         :default-checked-keys="defKeys"
                         ref="treeRef"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogClosed">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import Bread from '../common/Breadcrumb.vue'
    import Dialog from './RoleDialog.vue'
    export default {
        name: 'RoleList',
        components: {
            'bread': Bread,
            'role-dialog': Dialog
        },
        data() {
            return {
                rolelist: [],
                // 权限对话框是否显示
                rightDialogVisible: false,
                // 权限对话框
                rightsList: [],
                // 树形设置
                defaultProps:{
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中节点的id值数组
                defKeys:[],
                //待分配的角色id
                roleId: ''
            }
        },
        methods: {
            // 加载列表
            getRolesList() {
                // const {
                //     data: res
                // } = await this.$http.get('roles');
                // //console.log(res);
                // if (res.meta.status !== 200) {
                //     return this.$message.error('获取角色列表失败！');
                // }
                // this.rolelist = res.data;
                this.$api.roles.GetRolesList().then(res => {
                    this.rolelist = res.data;
                }).catch(err => {
                    this.$message.error('获取角色列表失败！');
                })
            },
            // 打开添加角色按钮事件
            AddRole() {
                this.$store.commit('AddRoleDialog');
            },
            // 打开修改角色按钮事件
            EditRole(id) {
                this.$store.commit('EditRoleDialog', id);
            },
            // 删除角色byid
            removeRoleById(id) {
                this.$confirm('此操作将删除此角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async (result) => {
                    if (result === 'confirm') {
                        // const {
                        //     data: res
                        // } = await this.$http.delete('roles/' + id)

                        // if (res.meta.status !== 200) {
                        //     return this.$message.error('删除角色失败！')
                        // } else {
                        //     this.$message({
                        //         type: 'success',
                        //         message: '删除成功!'
                        //     });
                        // }
                        // this.getRolesList();
                        await this.$api.roles.DelRole(id).then(res => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getRolesList();
                        }).catch(err => {
                            this.$message.error('删除角色失败！')
                        })
                    }
                }).catch((result) => {
                    if (result === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    }
                });
            },
            // 删除权限
            removeRightById(role, id) {
                this.$confirm('此操作将删除此权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async (result) => {
                    if (result === 'confirm') {
                        // const {
                        //     data: res
                        // } = await this.$http.delete(`roles/${role.id}/rights/${id}`);
                        // if (res.meta.status !== 200) {
                        //     return this.$message.error('删除权限失败');
                        // }
                        // //console.debug(res);
                        // this.$message({
                        //     type: 'success',
                        //     message: '删除成功!'
                        // });
                        // role.children = res.data;
                        await this.$api.roles.DelRoleRight(role.id,id).then(res => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            role.children = res.data;
                        }).catch(err => {
                            this.$message.error('删除权限失败')
                        })
                    }
                }).catch((err) => {
                    if (err === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    }
                });
            },
            // 打开分配权限
            async showRightDialog(role) {
                // 获取所有权限的数据
                // const {data: res} = await this.$http.get('rights/tree')

                // if (res.meta.status !== 200) {
                //     return this.$message.error('获取权限失败');
                // }
                // this.rightsList = res.data;
                // this.roleId = role.id;
                // this.getLeafKeys(role,this.defKeys);
                // this.rightDialogVisible = true;

                this.$api.rights.GetRightsTree().then(res => {
                    this.rightsList = res.data;
                    this.roleId = role.id;
                    this.getLeafKeys(role,this.defKeys);
                    this.rightDialogVisible = true;
                }).catch(err => {
                    this.$message.error('获取权限失败');
                })
            },
            // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys中
            getLeafKeys(node,arr){
                // 如果当前的node 节点不包含children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id);
                }
                node.children.forEach(element => {
                    this.getLeafKeys(element,arr)
                });
            },
            // 分配权限对话框关闭
            setRightDialogClosed(){
                this.defKeys = [];
                this.rightDialogVisible = false;
            },
            // 点击为角色分配权限
            allotRights(){
                let keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];

                let idStr = keys.join(',')

                // let {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr});

                // if (res.meta.status !== 200) {
                //     return this.$message.error('分配权限失败');
                // }else if(res.meta.status === 200){
                //     this.$message.success('分配权限成功');
                // }

                this.$api.roles.AssignRoleRight(this.roleId,{rids: idStr}).then(res => {
                    this.$message.success('分配权限成功');
                }).catch(err => {
                    this.$message.error('分配权限失败');
                })

                this.getRolesList();

                this.rightDialogVisible = false;
            }
        },
        created() {
            this.getRolesList();
        }
    }
</script>
<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>