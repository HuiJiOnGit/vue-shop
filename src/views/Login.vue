<template>
  <div class="login-container">
    <i class="login-bg" :class="style"></i>
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form class="login-form" ref="loginFormRef" :model="formdata" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="formdata.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名" @focus="onFocus"
            @blur="onBlur"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formdata.password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" type="password"
            @focus="onFocus" @blur="onBlur"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="login('loginFormRef')">登陆</el-button>
          <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formdata: {
          username: 'admin',
          password: '123456'
        },
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
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ]
        },
        style: {
          blur: false
        }
      }
    },
    methods: {
      resetLoginForm(refname) {
        console.log(refname);
        this.$refs[refname].resetFields();
      },
      login(refname) {
        this.$refs[refname].validate(valid => {
          if (!valid) {
            return;
          }
          // let {data: res} = await this.$http.post("login",this.formdata);
          // if (res.meta.status !== 200) return this.$message.error('login error');
          // this.$message.success('login success');
          // window.sessionStorage.setItem('token',res.data.token);
          // this.$router.push('/home');
          this.$api.login.userLogin(this.formdata).then(res => {
            this.$message.success('login success');
            window.sessionStorage.setItem('token',res.data.token);
            this.$router.push('/home');
          }).catch(err =>{
            this.$message.error(err.meta.msg);
          })
          // this.$api.login.test();
        })
      },
      //input获得焦点事件
      onFocus() {
        this.style.blur = true;
      },
      //input失去焦点事件
      onBlur() {
        this.style.blur = false;
      }
    }
  };
</script>
<style lang="less" scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .login-bg {
    background: url("https://cn.bing.com/th?id=OHR.TokyoMoat_ZH-CN1430508337_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 500ms ease-in-out;
  }

  .blur {
    -webkit-filter: blur(20px);
    -moz-filter: blur(20px);
    -ms-filter: blur(20px);
    filter: blur(20px);
  }

  .login-box {
    width: 28vw;
    height: 20vh;
    min-width: 400px;
    min-height: 300px;
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

    .login-form {
      min-width: 360px;
      text-align: center;
    }
  }
</style>