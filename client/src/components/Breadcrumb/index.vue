<template>
  <!-- <div class="app-breadcrumb-wrap"> -->
    <el-breadcrumb class="app-breadcrumb" separator="/" v-if="levelList && levelList.length > 0">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
          <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
          <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  <!-- </div> -->
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      /* let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }*/
      const matched = []
      this.$route.matched.filter(item => item.name).map(r => {
        if (r.meta.parentName) {
          matched.push({ path: r.meta.parentPath, meta: { title: r.meta.parentName }})
        }
        matched.push(r)
      })
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb-wrap {
    height: 45px;
    background-color: #fff;
  }
  .app-breadcrumb.el-breadcrumb {
    display: block;
    font-size: 14px;
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    color: #b5b5b5;
    background-color: #fff;
    .no-redirect {
      color: #b5b5b5;
      cursor: text;
    }
    .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{
      color: #5c80bb;
    }
  }
</style>
