<template>
	<el-select class="el-select-group" v-model="selected" :placeholder="placeholder"  filterable clearable 
    :size="size" :multiple="multiple" :filter-method="handleSelectFilter" 
    @change="handleSelectedChange"  @clear="handleSelectedClear" @visible-change="handleVisibleChange">
    <el-option-group-fold
      v-for="group in userList"
      :key="group.departmentCode"
      :label="group.departmentName"
      :defaultOpen="!!group.extend3">
      <el-option
        v-for="item in group.employeeInfoList"
        :key="item.userId"
        :label="item.userName"
        :value="item.userId"
        :disabled="disabledData && disabledData.includes(item.userId)">
      </el-option>
    </el-option-group-fold>
  </el-select>
</template>
<script>
import ElOptionGroupFold from '@/components/UserSelect/components/ElOptionGroupFold'
import { getUserByDept } from '@/api/dept'
import { objDeepCopy } from '@/utils/index'
export default {
	name: 'UserSelect',
  components: { ElOptionGroupFold },
  props: {
    value: {
      required: true
    },
    placeholder: String,
    size: String,
    multiple: Boolean,
    disabledData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selected: this.multiple ? [] : {},
      userList: [],
      userListCache: []
    }
  },
  created() {
  	getUserByDept(-1).then(v => {
      this.userList = v.map(u => {
        let flag = false
        u.employeeInfoList.forEach(e => {
          if ((this.multiple && this.value.includes(e.userId)) || this.value === e.userId) {
            flag = true
          }
        })
        if (flag) {
          v.extend3 = true
        }
        return u
      })
      this.userListCache = objDeepCopy(this.userList)
      this.selected = this.value
    })
  },
  methods: {
  	handleSelectedChange(val) {
  		this.$emit('update:value', val)
  	},
    handleSelectedClear() {
      this.userList = objDeepCopy(this.userListCache)
    },
    handleVisibleChange(flag) {
      if (flag && (!this.userList || this.userList.length === 0)) {
        this.userList = objDeepCopy(this.userListCache)
      }
    },
    handleSelectFilter(query) {
      const list = objDeepCopy(this.userListCache)
      if (query) {
        this.userList = list.filter(group => {
          const list = []
          group.employeeInfoList.forEach(e => {
            if (e.userName.indexOf(query) > -1) {
              list.push(e)
            }
          })
          if (list.length > 0) {
            group.employeeInfoList = list
            group.extend3 = true
            return true
          } else {
            return false
          }
        })
      } else {
        this.userList = list
      }
    }
  }
}
</script>
<style type="stylesheet/scss" lang="scss">
  .el-select-group{
    width: 100%;
  }
</style>