<template>
  <ul :class="['el-select-group__wrap', iconClass]" v-show="visible" @click="handleGroupCollapse">
    <li class="el-select-group__title">
      <span class="el-select-group__inner">{{ label }}</span>
      <span class="el-select-group__suffix">
        <span class="el-select-group__suffix-inner">
          <i :class="['el-select__caret', 'el-select-group__icon', 'el-icon-' + iconClass]"></i>
        </span>
      </span>
    </li>
    <li>
      <ul class="el-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script>
  import Emitter from 'element-ui/src/mixins/emitter'

  export default {
    mixins: [Emitter],

    name: 'ElOptionGroupFold',

    componentName: 'ElOptionGroupFold',

    props: {
      label: String,
      defaultOpen: Boolean,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: true,
        open: false
      }
    },

    computed: {
      iconClass: {
        get: function() {
          return this.open ? 'arrow-up is-reverse' : 'arrow-up'
        }
      }
    },

    watch: {
      defaultOpen(val) {
        this.open = val
      },
      disabled(val) {
        this.broadcast('ElOption', 'handleGroupDisabled', val)
      }
    },

    methods: {
      queryChange() {
        this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.visible === true)
      },
      handleGroupCollapse() {
        this.open = !this.open
      }
    },

    created() {
      this.open = this.defaultOpen
      this.$on('queryChange', this.queryChange)
    },

    mounted() {
      if (this.disabled) {
        this.broadcast('ElOption', 'handleGroupDisabled', this.disabled)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-select-group__wrap{
    .el-select-group{
      display: none;
    }
  }
  .el-select-group__wrap.is-reverse{
    .el-select-group{
      display: block;
    }
  }
  .el-select-group__title{
    position: relative;
    cursor: pointer;
  }
  .el-select-group__inner{
    -webkit-appearance: none;
    box-sizing: border-box;
    color: #606266;
    font-weight: 600;
    display: inline-block;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    outline: none;
    padding-right: 30px;
    width: 100%;
  }
  .el-select-group__icon::after {
    content: "";
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle;
  }
  .el-icon-arrow-up::before {
      content: "\E605";
  }
  .el-select-group__title .el-select__caret {
    color: #c0c4cc;
    font-size: 14px;
    transition: transform .3s;
    transform: rotate(180deg);
    cursor: pointer;
  }
  .el-select-group__title .el-select__caret.is-reverse {
    transform: rotate(0deg);
  }
  .el-select-group__suffix{
    position: absolute;
    height: 100%;
    right: 20px;
    top: 0;
    text-align: center;
    color: #c0c4cc;
    transition: all .3s;
    pointer-events: none;
  }
  .el-select-group__suffix-inner{
    pointer-events: all;
    vertical-align: baseline;
  }
  .el-select-group__wrap:not(:last-of-type){
    padding-bottom: 5px;
  }
  .el-select-group__wrap:not(:last-of-type)::after{
    height: 0
  }
</style>