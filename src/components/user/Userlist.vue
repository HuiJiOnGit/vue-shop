<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" @clear="getUsrList"
            clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUsrList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="AddUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- table部分 -->
      <el-row>
        <el-table :data="userlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <template v-slot:default="scope">
              <el-switch v-model="scope.row.mg_state" active-text="未启用" inactive-text="启用"
                @change="userStateChanged(scope.row)">
                <p>hello</p>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scope">
              <!-- 修改 -->
              <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditUser(scope.row.id)"></el-button>
              </el-tooltip>
              <!-- 删除 -->
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              </el-tooltip>
              <!-- 分配角色 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!-- 对话框 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%" @close="CloseDialog">
        <el-form :model="userform" :rules="rules" ref="FormRef">
          <el-form-item label="用户名" label-width="70px" prop="username">
            <el-input v-model="userform.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="70px" prop="password" v-if="dialogFormPasswordItemVisible">
            <el-input v-model="userform.password" autocomplete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="70px" prop="email">
            <el-input v-model="userform.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" label-width="70px" prop="mobile">
            <el-input v-model="userform.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <!-- dibu -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="CancelDialog">取 消</el-button>
          <el-button type="primary" @click="UserCommit">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Userlist",
    data() {
      let checkeamil = (rule,value,cb) => {
        let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (regEmail.test(value)) {
          return cb();
        }
        cb(new Error('请输入合法的邮箱'))
      }
      let checkmobile = (rule,value,cb) => {
        let regmobile = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (regmobile.test(value)) {
          return cb();
        }
        cb(new Error('请输入合法的手机号'))
      }

      return {
        // 查询用户列表参数
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前页显示几条数据
          pagesize: 10
        },
        // 用户list
        userlist: [],
        // 总数量
        total: 0,
        // 对话框是否显示
        dialogFormVisible: false,
        // 对话框中的userform
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
            }],
          email:[{
            required: true,
            message: '请输入email',
            trigger: 'blur'
          },
          {
            validator: checkeamil,
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请输入mobile',
            trigger: 'blur'
          },
          {
            validator: checkmobile,
            trigger: 'blur'
          }]
        },
        // 对话框密码form-item是否显示
        dialogFormPasswordItemVisible: true,
        // 对话框title
        dialogTitle: ''
      }
    },
    methods: {
      async getUsrList() {
        let {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        });
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败');
        }
        this.userlist = res.data.users;
        this.total = res.data.total;
        console.log(res);
      },
      // pagesize改变事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val;
        this.getUsrList();
      },
      // 切换页码事件
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val;
        this.getUsrList();
      },
      // 监听 switch开关状态
      async userStateChanged(userinfo) {
        console.log(userinfo);
        let {
          data: res
        } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('更新用户状态失败');
        }
        this.$message.success('更新用户状态成功');
      },
      // 对话框关闭事件
      CloseDialog(){
        this.$refs.FormRef.resetFields();
        this.dialogFormPasswordItemVisible = true;
      },
      // 对话框确定事件
      UserCommit(){
         this.$refs.FormRef.validate(async valid => {
           if (!valid) {
             return
           }
           // 这里区分是添加还是修改
           let {data: res} = await this.$http.post('users',this.userform);

           if (res.meta.status !== 201) {
             this.$message.error('添加用户失败');
             return
           }
           this.$message.success('添加用户成功');
           this.dialogFormVisible = false;
         })
      },
      // 打开修改用户按钮事件
      EditUser(id){
        this.dialogFormVisible = true;
        this.dialogFormPasswordItemVisible = false;
        this.dialogTitle = '修改用户';
        /*修改不想做了*/
      },
      // 打开添加用户按钮事件
      AddUser(){
        this.dialogFormVisible = true;
        this.dialogTitle = '添加用户';
      },
      // 对话框取消事件
      CancelDialog(){
        this.dialogFormVisible = false;
        //this.dialogFormPasswordItemVisible = true;
        this.CloseDialog();
      },
      // 删除用户byid
      removeUserById(id){
        this.$confirm('此操作将删除此用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    created() {
      this.getUsrList();
    }
  }
</script>
<style lang="less" scoped>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
