<template>
  <div class="app-wrapper" :class="classObj">
    <navbar></navbar>
    <div class="main-container">
      <sidebar class="sidebar-container"></sidebar>
      <app-main></app-main>
    </div>
    <footer>智英实业软件公司</footer>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
// import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  // mixins: [ResizeMixin],
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    resizeHandler() {
      if (!document.hidden) {
        this.$store.commit('SET_APPHEIGHT', this.$el.clientHeight)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color:#6a6a6a;
      text-align: center;
      background-color: #c7cdcf;
      z-index: 2;
    }
  }
</style>
