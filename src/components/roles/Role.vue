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
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
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
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 对话框 -->
            <role-dialog @updateRolesList="getRolesList"></role-dialog>

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
                rolelist: []
            }
        },
        methods: {
            // 加载列表
            async getRolesList() {
                const {
                    data: res
                } = await this.$http.get('roles');
                console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败！');
                }
                this.rolelist = res.data;
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
                        const {
                            data: res
                        } = await this.$http.delete('roles/' + id)

                        if (res.meta.status !== 200) {
                            return this.$message.error('删除角色失败！')
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }

                        this.getRolesList();
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
                        const {
                            data: res
                        } = await this.$http.delete(`roles/${role.id}/rights/${id}`);
                        if (res.meta.status !== 200) {
                            return this.$message.error('删除权限失败');
                        }
                        console.debug(res);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        role.children = res.data;
                    }
                }).catch((err) => {
                    if (err === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    }
                });
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