<template>
  <div>
    <div class="navbar" mode="horizontal">
      <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
      <!-- <a class="notice" @click="handleViewNotice(noticeList[nowNoticeIndex])" v-if="noticeList && noticeList.length > 0">公告： {{noticeList[nowNoticeIndex].title}}</a> -->
      <!-- <span class="time" v-html="nowTime"></span> -->
      <img src="../../../imgs/logo.png">
      <div class="top-menu">
        <el-menu mode="horizontal" background-color="#467cd4"
          text-color="#fff" @select="handleMenuSelect" :default-active="$store.getters.mainCode">
          <el-menu-item v-for="item in mainModules" :index="item.moduleCode" :key="item.moduleCode">{{item.moduleName}}</el-menu-item>
        </el-menu>
      </div>
      <div class="navbar-right">
        <ul>
          <li><span class="user-info">欢迎您：{{name}}</span></li>
          <li><a @click="passVisible=true">重置密码</a></li>
          <li><a @click="logout">退出登录</a></li>
        </ul>
      </div>
      <!--
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="defaultAvatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link> divided
          <el-dropdown-item>
            <span @click="passVisible=true" style="display:block;">重置密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <el-dialog title="重置密码" :visible.sync="passVisible" @close="closeForm('dataForm')">
      <el-form :rules="passRules" ref="dataForm" :model="pwd" label-position="right" label-width="80px" size="medium">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="pwd.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="pwd.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="pwd.password2" />
        </el-form-item>
      </el-form>
      <div style="margin-top: 40px;text-align: right;">
        <el-button type="primary" size="small" @click="resetPass">保存</el-button>
        <el-button size="small" @click="passVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import defaultAvatar from '@/imgs/avatar.png'
import { resetPassword } from '@/api/user'
import { parseTime } from '@/utils'
import Cookies from 'js-cookie'
import md5 from 'md5'

export default {
  components: {
    Hamburger
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwd.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      defaultAvatar: defaultAvatar,
      passVisible: false,
      nowTime: '',
      noticeList: null,
      nowNoticeIndex: 0,
      noticeDetailVisible: false,
      notice: {},
      pwd: {
        password: '',
        oldPassword: '',
        password2: ''
      },
      passRules: {
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 5, message: '密码不能小于5位', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 5, message: '密码不能小于5位', trigger: 'blur' }
        ],
        password2: [
          { trigger: 'blur', validator: validatePass2 }
        ]
      },
      // messageCount: null, // 消息未读数
      messageEvent: null, // 角色配置的所有消息事件
      messageEventSubscribe: null // 用户角色绑定的所有事件
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'mainModules'
    ]),
    ...mapGetters({
      'messageCount': 'noReadMsgCount'
    })
  },
  created() {
    this.calculateTime()
  },
  methods: {
    calculateTime() {
      window.setInterval(() => {
        const now = new Date()
        this.nowTime = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日&nbsp;&nbsp' + now.toLocaleTimeString() + '&nbsp;&nbsp;&nbsp;星期' + parseTime(now, '{a}')
      }, 1000)
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
        if (window.yunba) {
          window.yunba.disconnect() // 关闭连接
        }
      })
    },
    resetPass() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) return false
        const pwdMd5 = md5(this.pwd.password)
        const oldPwdMd5 = md5(this.pwd.oldPassword)
        resetPassword({ password: pwdMd5, oldPassword: oldPwdMd5 }).then(() => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.logout()
        })
      })
    },
    closeForm(form) {
      this.$refs[form].resetFields()
      this.$refs[form].clearValidate()
    },
    handleMenuSelect(index) {
      this.$store.dispatch('changeRouters', index).then(() => {
        Cookies.set('mainCode', index)
        if (index === 'mainIndex') {
          this.$router.push({
            path: '/'
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding-left: 0;
  height: 50px;
  border-radius: 0px !important;
  border: 0;
  background-color: #467cd4;
  z-index: 999;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .top-menu{
    display: inline-block;
  }
  .notice{
    position: absolute;
    top: 35px;
    height: 20px;
    left: 360px;
    right: 400px;
    font-size: 15px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
  }
  .el-menu--horizontal{
    border: 0;
  }
  .el-menu--horizontal>.el-menu-item{
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    border-bottom: 0;
  }
  .el-menu--horizontal>.el-menu-item.is-active{
    border-bottom: 0;
    background-color: #3a67b0!important;
    color: #fff;
    &:after{
      content: '';
      position: absolute;
      bottom: 10px;
      left: 5px;
      right: 5px;
      border: 0;
    }
  }
  .navbar-right{
    position: absolute;
    height: 50px;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 360px;
    font-size: 12px;
    color: #fff;
    ul{
      padding: 0;
    }
    li{
      position: relative;
      display: inline-block;
      margin-right: 20px;
      list-style: none;
      color: #fff;
      &:nth-child(2):after{
        content: '';
        position: absolute;
        display: block;
        right: -14px;
        top: 0;
        bottom: 0;
        width: 1px;
        border-left: 1px solid #fff;
      }
    }
  }
}
</style>
<style>
  .message .el-badge__content.is-fixed{
    top: 2px;
  }
  .message .el-badge__content{
    border: 0;
  }
</style>
