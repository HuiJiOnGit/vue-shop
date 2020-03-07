<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form class="login-form" ref="loginFormRef" :model="formdata" :rules="rules">
        <el-form-item prop="usernameRule">
          <el-input v-model="formdata.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="passwordRule">
          <el-input v-model="formdata.password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            formdata:{
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetLoginForm(formName){
            console.log(this.$refs);
            this.$refs.loginFormRef.resetFields();
            //console.log('hello');
            //this.$refs.loginFormRef.resetFields();
        }
    }
};
</script>
<style lang="less" scoped>
.login-container {
  //background-color: #eee;
  background: url("https://cn.bing.com/th?id=OHR.TokyoMoat_ZH-CN1430508337_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  width: 28vw;
  height: 20vh;
  min-width: 400px;
  min-height: 300px;
  //background-color: #ddd;
  //border: 3px solid red;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 

  .avatar-box {
    width: 120px;
    height: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    transform: translateY(-50px);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login-form{
      min-width: 360px;      
  }
}
</style>