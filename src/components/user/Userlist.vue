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
      <user-dialog @updateUserList='getUsrList'></user-dialog>

    </el-card>
  </div>
</template>

<script>
  import UserDialog from './UserDialog.vue'
  export default {
    name: "Userlist",
    components:{
      'user-dialog':UserDialog
    },
    data() {    
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
        total: 0
      }
    },
    methods: {
      // 获取用户列表
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
        // console.log(res);
      },
      // pagesize改变事件
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val;
        this.getUsrList();
      },
      // 切换页码事件
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val;
        this.getUsrList();
      },
      // 监听 switch开关状态
      async userStateChanged(userinfo) {
        // console.log(userinfo);
        let {
          data: res
        } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('更新用户状态失败');
        }
        this.$message.success('更新用户状态成功');
      },
      // 打开添加用户按钮事件
      AddUser(){
        this.$store.commit('AddDialog');
      },
      // 打开修改用户按钮事件
      EditUser(id){
        this.$store.commit('EditDialog',id);
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
