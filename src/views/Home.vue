<template>
  <!-- 主体部分 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header :class="{'header-container-dark':getDark}">
      <div class="logo">
        <img src="../assets/heima.png"
             alt="电商管理后台">
        <span>电商管理后台</span>
      </div>
      <div class='header-right'>
        <span @click="onVan">
          Deep♂Dark♂Fantsy
        </span>
        <el-button @click="logout">登出</el-button>
      </div>
      <!-- <el-button @click="logout">登出</el-button> -->
    </el-header>
    <el-container class="{'container-bg-dark':getDark}">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" :class="{'left-dark':getDark}">
        <div class="toggle-button"
             @click="toggleCollapse" :class="togglestyle">|||</div>
        <!-- 菜单组件 -->
        <el-menu :default-active="this.$route.path"
                 background-color="rgba(0,0,0,0)"
                 text-color="#000000"
                 active-text-color="#B22222"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router>
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
      <el-main class="welcome" :class="{'container-bg-dark':getDark}">
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
        isCollapse: false,
        togglestyle:{toggle:false},
        dark:false
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
        this.isCollapse = !this.isCollapse;
        this.togglestyle.toggle=this.isCollapse
      },
      //变van模式
      onVan(){
        this.dark=!this.dark
        this.$store.commit('onVan',this.dark);
      }
    },
    created() {
      this.getMenuList()
    },
    computed:{
      getDark(){
        return this.$store.state.dark
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100vh;
  }
  .el-header {
    background-color:#409EFF;
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
    overflow:hidden;
    background-color: #fff;
    border-right:1px solid rgba(128,128,128,.1);
    color: #333;
  .el-menu {
    border-right: none;
  }
  }

  .toggle-button {
    line-height: 32px;
    color: #409EFF;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
    user-select:none;
    font-size:16px;
    font-weight:600;
    transition:all 500ms ease-in-out;
    margin-top:5px;
  }

  .el-main {
  //background-color: #FFFFFF;
    /* background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%); */
    color: #333;
  }
  .welcome{
    background:rgba(128,128,128,.1);
  }
  /deep/.welcome>div{
    width:100%;
  }
  .logo{
    width:200px;
    height:40px;
    display:inline-block;
    padding: 0;
    padding-left:20px;
    box-sizing:border-box;
    display:flex;
    flex-wrap:wrap;
    align-items:center;
    justify-content:space-around;
  >img{
    height:100%;
    width:auto;
    -webkit-filter: brightness(0%) invert(100%);
    -moz-filter: brightness(0%) invert(100%);
    -ms-filter: brightness(0%) invert(100%);
    filter: brightness(0%) invert(100%);
  }
  >span{
    font-size:18px;
    font-weight:600;
    /* color:#409EFF; */
    color:#fff;
  }
  }
  .toggle{
    transform:rotate(90deg);
    font-weight:100;
  }
  li.is-opened .el-submenu__title{
  >span{
    color:#409EFF;
  }
  >i{
    color:#409EFF;
  }
  transition:all 500ms ease-in-out;
  }
  /deep/li .el-submenu__title:hover{
  >span{
    color:#fff;
  }
  >i{
    color:#fff;
  }
  background-color:#409EFF !important;
  }
  ul.el-menu--inline>li{
    text-align:right;
  }
  li.is-active{
    color:#409EFF;
  >span{
    color:#409EFF;
  }
  >i{
    color:#409EFF;
  }
  }
  .el-menu-item{
    transition:all 500ms ease-in-out;
  }
  .el-menu-item:hover{
  >span{
    color:#fff;
  }
  >i{
    color:#fff;
  }
  background-color:#409EFF !important;
  }
  .header-right{
    >span{
      font-size:14px;
      color:#fff;
      display:inline-block;
      margin:0 10px;
      cursor:pointer;
      user-select:none;
    }
  }
</style>
