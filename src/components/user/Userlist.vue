<template>
  <div>
    <!-- 面包屑部分 -->
    <bread title1="活动管理" title2="活动列表"></bread>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            @clear="getUsrList"
            clearable
          >
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
              <el-switch
                v-model="scope.row.mg_state"
                active-text="未启用"
                inactive-text="启用"
                @change="userStateChanged(scope.row)"
              >
                <p>hello</p>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scope">
              <!-- 修改 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="EditUser(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <!-- 删除 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeUserById(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <!-- 分配角色 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 用户新增修改对话框 -->
      <user-dialog @updateUserList="getUsrList"></user-dialog>

      <el-dialog 
      title="提示" 
      :visible.sync="setRoleVisible" 
      width="30%" 
      @close="roleDialogClose">
        <p>当前用户名：{{userInfo.username}}</p>
        <p>当前用户角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import UserDialog from "./UserDialog.vue"
import Bread from "../common/Breadcrumb.vue"
export default {
  name: "Userlist",
  components: {
    "user-dialog": UserDialog,
    bread: Bread
  },
  data() {
    return {
      // 查询用户列表参数
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前页显示几条数据
        pagesize: 10
      },
      // 用户list
      userlist: [],
      // 总数量
      total: 0,
      // 设置角色对话框
      setRoleVisible: false,
      // 分配权限用户信息
      userInfo: {},
      // 所有角色列表
      rolesList: [],
      // 分配新角色选中id
      selectRoleId:null
    }
  },
  methods: {
    // 获取用户列表
    getUsrList() {
      // let { data: res } = await this.$http.get("users", {
      //   params: this.queryInfo
      // })
      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取用户列表失败")
      // }   
      // this.userlist = res.data.users
      // this.total = res.data.total   
      this.$api.user.GetUserList(this.queryInfo).then(res => {
        this.$message.success(res.meta.msg)
        this.userlist = res.data.users
        this.total = res.data.total
      }).catch(err => {
        this.$message.error(err.meta.msg)
      })
    },
    // pagesize改变事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val
      this.getUsrList()
    },
    // 切换页码事件
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val
      this.getUsrList()
    },
    // 监听 switch开关状态
    userStateChanged(userinfo) {
      // console.log(userinfo);
      // let { data: res } = await this.$http.put(
      //   `users/${userinfo.id}/state/${userinfo.mg_state}`
      // )
      // if (res.meta.status !== 200) {
      //   userinfo.mg_state = !userinfo.mg_state
      //   return this.$message.error("更新用户状态失败")
      // }
      // this.$message.success("更新用户状态成功")

      this.$api.user.ChangeUserStatus(userinfo.id,userinfo.mg_state).then(res => {
        this.$message.success("更新用户状态成功")
      }).catch(err => {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error("更新用户状态失败")
      })
    },
    // 打开添加用户按钮事件
    AddUser() {
      this.$store.commit("AddUserDialog")
    },
    // 打开修改用户按钮事件
    EditUser(id) {
      this.$store.commit("EditUserDialog", id)
    },
    // 删除用户byid
    removeUserById(id) {
      this.$confirm("此操作将删除此用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async result => {
          if (result === "confirm") {
            // const { data: res } = await this.$http.delete("users/" + id)

            // if (res.meta.status !== 200) {
            //   return this.$message.error("删除用户失败！")
            // }
            // this.$message({
            //   type: "success",
            //   message: "删除成功!"
            // })
            // this.getUsrList()
            await this.$api.user.DelUser(id).then(res => {
              this.$message({
              type: "success",
              message: "删除成功!"
              })
              this.getUsrList()
            }).catch(err => {
              this.$message.error(err.meta.msg);
            })

          }
        })
        .catch(result => {
          if (result === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            })
          }
        })
    },
    // 打开设置角色对话框
    setRole(userInfo) {
      this.userInfo = userInfo
      // let { data: res } = await this.$http.get(`roles`)
      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取角色列表失败")
      // }
      // this.rolesList = res.data
      // this.setRoleVisible = true
      this.$api.roles.GetRolesList().then(res => {
        this.rolesList = res.data
        this.setRoleVisible = true
      }).catch(err => {
        this.$message.error("获取角色列表失败")
      })
    },
    // 保存设置权限
    saveRoleInfo(){
      if (!this.selectRoleId) {
        this.setRoleVisible = false;
      }

      // let {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
      //   rid: this.selectRoleId
      // });

      // if (res.meta.status !== 200) {
      //   return this.$message.error('更新用户角色失败');
      // }

      // this.$message.success('更新用户角色成功');
      // this.getUsrList();
      // this.setRoleVisible = false;
      // this.selectRoleId = null;

      this.$api.user.AssignRoles(this.userInfo.id,{rid: this.selectRoleId}).then(res => {
        this.$message.success('更新用户角色成功');
      }).catch(err => {
        this.$message.error('更新用户角色失败');
      })
      this.getUsrList();
      this.setRoleVisible = false;
      this.selectRoleId = null;

    },
    // 分配角色对话框关闭事件
    roleDialogClose(){
      this.setRoleVisible = false;
      this.selectRoleId = null;
    }
  },
  created() {
    this.getUsrList()
  }
}
</script>
<style lang="less" scoped>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>