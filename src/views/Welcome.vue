<template>
    <div class="welcome-container">
        <h1 class='welcome-font-title'>Welcome</h1>
        <p class="welcome-font-name">电商管理系统</p>
    </div>
</template>

<script>
  export default {
    name:'Welcome',
    data(){
      return{

      }
    }
  }
</script>

<style lang="less" scoped>
    .welcome-container{
        width:100%;
        height:100%;
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        align-items:center;
        align-content: center;
        user-select:none;
    }
    .welcome-font-title{
        width:100%;
        font-size:4vmax;
        margin:0;
        padding:0;
        color:#409EFF;
    }
    .welcome-font-name{
        width:100%;
        font-size:3vmax;
        font-weight:100;
        margin:0;
        padding:0;
        color:#409EFF;
    }
</style>
