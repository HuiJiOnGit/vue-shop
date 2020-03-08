<template>
  <!-- 主体部分 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png"
             alt="">
        <span>电商管理后台</span>
      </div>
      <el-button @click="logout">登出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button"
             @click="toggleCollapse">|||</div>
        <!-- 菜单组件 -->
        <el-menu default-active="2"
                 background-color="rgba(0,0,0,0)"
                 text-color="#000000"
                 active-text-color="#B22222"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="this.$route.path">
          <!-- 菜单下拉 -->
          <el-submenu :index="item.id + ''"
                      v-for="item in menulist"
                      :key="item.id">
            <!-- 菜单下拉title -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- mian -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  data() {
    return {
      // 左侧菜单
      menulist: [],
      isCollapse: false
    }
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear()
      //跳转登陆页
      this.$router.push("/login")
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus")
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  //background-color: #BEBEBE;
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: black;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  //background-color: #D3D3D3;
  background-image: linear-gradient(169deg, #4facfe 0%, #00f2fe 100%);
  color: #333;
  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  font-size: 10px;
  line-height: 24px;
  color: black;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
  user-select:none;
}

.el-main {
  //background-color: #FFFFFF;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  color: #333;
}
</style>
