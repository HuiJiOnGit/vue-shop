<template>
    <div>
        <!-- 对话框 -->
        <el-dialog :title="getTitle" :visible.sync="getDialogFormVisible" width="30%" @close="CloseDialog"
            @open='OpenDialog'>
            <el-form :model="userform" :rules="rules" ref="FormRef">
                <el-form-item label="用户名" label-width="70px" prop="username">
                    <el-input v-model="userform.username" autocomplete="off" :disabled='getUserDisabled'></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="70px" prop="password" v-if="getDialogFormPasswordItemVisible">
                    <el-input v-model="userform.password" autocomplete="off" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="70px" prop="email">
                    <el-input v-model="userform.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" label-width="70px" prop="mobile">
                    <el-input v-model="userform.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="CloseDialog">取 消</el-button>
                <el-button type="primary" @click="UserCommit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'UserDialog',
        data() {
            // 邮箱和手机号验证规则
            let checkeamil = (rule, value, cb) => {
                let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if (regEmail.test(value)) {
                    return cb();
                }
                cb(new Error('请输入合法的邮箱'))
            }
            let checkmobile = (rule, value, cb) => {
                let regmobile = /^1(3|4|5|6|7|8|9)\d{9}$/;
                if (regmobile.test(value)) {
                    return cb();
                }
                cb(new Error('请输入合法的手机号'))
            }

            return {
                userform: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 对话框中的userform验证规则
                rules: {
                    username: [{
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入password',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    email: [{
                            required: true,
                            message: '请输入email',
                            trigger: 'blur'
                        },
                        {
                            validator: checkeamil,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: '请输入mobile',
                            trigger: 'blur'
                        },
                        {
                            validator: checkmobile,
                            trigger: 'blur'
                        }
                    ]
                },
            }
        },
        computed: {
            // 对话框title
            getTitle() {
                return this.$store.state.user.dialogTitle
            },
            // 对话框是否显示
            getDialogFormVisible: {
                get: function () {
                    return this.$store.state.user.dialogFormVisible
                },
                set: function () {
                    this.$store.commit('CloseDialog');
                }
            },
            // 对话框密码form-item是否显示
            getDialogFormPasswordItemVisible() {
                return this.$store.state.user.dialogFormPasswordItemVisible
            },
            // 用户名
            getUserDisabled(){
                return this.$store.state.user.UserDisabled
            }
        },
        methods: {
            // 打开对话框事件
            async OpenDialog() {
                let id = this.$store.state.user.userId;
                if (id !== null) {
                    let {
                        data: res
                    } = await this.$http.get('users/' + id);
                    if (res.meta.status !== 200) {
                        return this.$message.error('查询用户信息失败！')
                    }

                    this.userform = res.data
                }
            },
            // 对话框关闭事件
            CloseDialog() {
                this.$refs.FormRef.resetFields();
                this.$store.commit('CloseDialog', false);
            },
            // 对话框确定事件
            UserCommit() {
                this.$refs.FormRef.validate(async valid => {
                    if (!valid) {
                        return
                    }
                    let id = this.$store.state.user.userId;
                    // 这里区分是添加还是修改
                    if (this.$store.state.user.userId === null) {
                        let {
                            data: res
                        } = await this.$http.post('users', this.userform);

                        if (res.meta.status !== 201) {
                            this.$message.error('添加用户失败');
                            return
                        }
                        this.$message.success('添加用户成功');
                    } else {
                        // 发起修改用户信息的数据请求
                        let {
                            data: res
                        } = await this.$http.put(
                            'users/' + id, {
                                email: this.userform.email,
                                mobile: this.userform.mobile
                            }
                        )
                        if (res.meta.status !== 200) {
                            return this.$message.error('更新用户信息失败！')
                        }
                        // 提示修改成功
                        this.$message.success('更新用户信息成功！')
                    }
                    // 关闭窗口
                    this.$store.commit('CloseDialog', false);
                    // 重新获取用户列表数据
                    this.$emit('updateUserList')
                })
            }
        },
    }
</script>
<style lang="less" scoped>

</style>