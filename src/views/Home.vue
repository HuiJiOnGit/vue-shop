<template>
  <div class="home">
    <img alt="Vue logo"
         src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <el-button @click="logout">logout</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear()
      //跳转登陆页
      this.$router.push("/login")
    }
  }
}
</script>
