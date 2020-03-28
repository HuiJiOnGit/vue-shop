<template>
    <div>
        <!-- 对话框 -->
        <el-dialog :title="getTitle" :visible.sync="getDialogFormVisible" width="30%" @close="CloseDialog"
            @open='OpenDialog'>
            <el-form :model="roleForm" :rules="rules" ref="FormRef">
                <el-form-item label="角色名称" label-width="70px" prop="roleDesc">
                    <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="70px" prop="roleName">
                    <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="CloseDialog">取 消</el-button>
                <el-button type="primary" @click="RoleCommit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                roleForm: {
                    roleName: '',
                    roleDesc: ''
                },
                rules: {
                    roleDesc: [{
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }],
                    roleName: [{
                        required: false,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    }]
                }
            }
        },
        computed: {
            // 对话框title
            getTitle() {
                return this.$store.state.role.dialogTitle
            },
            // 对话框是否显示
            getDialogFormVisible: {
                get: function () {
                    return this.$store.state.role.dialogFormVisible
                },
                set: function () {
                    this.$store.commit('CloseRoleDialog');
                }
            },
        },
        methods: {
            // 打开对话框事件
            async OpenDialog() {
                let id = this.$store.state.role.roleId;
                if (id !== null) {
                    let {
                        data: res
                    } = await this.$http.get('roles/' + id);
                    if (res.meta.status !== 200) {
                        return this.$message.error('查询角色信息失败！')
                    }

                    this.roleForm = res.data
                }
            },
            // 对话框关闭事件
            CloseDialog() {
                this.$refs.FormRef.resetFields();
                this.$store.commit('CloseRoleDialog', false);
            },
            // 对话框确定事件
            RoleCommit() {
                this.$refs.FormRef.validate(async valid => {
                    if (!valid) {
                        return
                    }
                    let id = this.$store.state.role.roleId;
                    // 这里区分是添加还是修改
                    if (this.$store.state.role.roleId === null) {
                        let {
                            data: res
                        } = await this.$http.post('roles', this.roleForm);

                        if (res.meta.status !== 201) {
                            this.$message.error('添加角色失败');
                            return
                        }
                        this.$message.success('添加角色成功');
                    } else {
                        // 发起修改角色信息的数据请求
                        let {
                            data: res
                        } = await this.$http.put(
                            'roles/' + id, {
                                roleName: this.roleForm.roleName,
                                roleDesc: this.roleForm.roleDesc
                            }
                        )
                        if (res.meta.status !== 200) {
                            return this.$message.error('更新角色信息失败！')
                        }
                        // 提示修改成功
                        this.$message.success('更新角色信息成功！')
                    }
                    // 关闭窗口
                    this.$store.commit('CloseRoleDialog', false);
                    // 重新获取角色列表数据
                    this.$emit('updateRolesList')
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>