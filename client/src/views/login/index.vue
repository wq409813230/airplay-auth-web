<template>
  <div class="login-container">
    <div class="leftSide">
      <h1>
        <img src="../../imgs/zhaotailogo.png" alt="">设备授权管理系统
      </h1>
      <p>airplay auth information management system</p>
      <i></i>
    </div>

    <el-tabs v-model="loginName" class="login-tab">
      <el-tab-pane label="账户密码登录" name="account">
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
          <!-- <h3 class="title">欢迎登录</h3> -->
          <el-form-item prop="loginId">
            <el-input name="loginId" type="text" v-model="loginForm.loginId" autoComplete="off" placeholder="请输入帐号..." />
          </el-form-item>
          <el-form-item prop="password">
            <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off"
              placeholder="请输入密码..."></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:40%;" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import md5 from 'md5'
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginId: '',
        password: ''
      },
      md5Password: '',
      loginRules: {
        loginId: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      loginName: 'account'
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.md5Password = md5(this.loginForm.password)
          this.$store.dispatch('Login', { loginId: this.loginForm.loginId.trim(), password: this.md5Password, agency: 'SUPER_ADMIN' }).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/css">
  .login-form .el-input__inner{
    background-color: transparent;
    color: #fff;
  }
  .login-tab .el-tabs__item{
    font-weight: normal;
    font-size: 20px;
    color: #fff;
    margin-bottom: 10px;
  }
  .login-tab .el-tab-pane{
    padding-top: 20px;
    width: 400px;
    height: 325px;
  }
  #login_container{
    width: 250px;
    height: 291px;
  }
</style>
<style rel="stylesheet/css" scoped>
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../../imgs/background.jpg") no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .leftSide{
    width: 800px;
    border-left: 4px solid #fff;
    padding: 20px 0 20px 56px;
  }
  .leftSide > h1{
    font-size: 36px;
    color: #fff;
    line-height: 70px;
    font-weight: normal;
    margin: 0;
  }
  .leftSide > h1 img{
    vertical-align: top;
    margin-right: 30px;
  }
  .leftSide > p{
    color: #fff;
    margin: 0;
    font-size: 24px;
    line-height: 50px;
    letter-spacing: 1px;
  }
  .login-form{
    width: 400px;
  }
  .leftSide i{
    display: block;
    width: 60px;
    height: 7px;
    background-color: #409eff;
    margin-top: 16px;
  }
  .title{
    font-weight: normal;
    font-size: 20px;
    color: #fff;
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid #fff;
   }
</style>
