<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      unique-opened
      background-color="#fff"
      text-color="#242b30"
      active-text-color="#5691b0"
    >
      <sidebar-item :routes="permission_routers" :mainCode="mainCode"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'mainCode'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
