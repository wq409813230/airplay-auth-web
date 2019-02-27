<template>
	<div class="app-container">
		<div class="filter-container">
	      <el-input @keyup.enter.native="handleFilter"  placeholder="机型名称" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.modelCode">
	      </el-input>
	      <el-button class="filter-item" type="primary"  size="medium" @click="handleFilter">查询</el-button>
	      <el-button class="filter-item" style="margin-left: 10px;"  size="medium"  @click="handleCreate" type="warning">新增</el-button>
	  </div>
		<el-table :data="list" :height="$store.getters.appHeight - 320" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
		  <el-table-column align="center" label='ID' width="95" type="index" />
		  <el-table-column label="机型名称" width="110">
		    <template slot-scope="scope">
		      {{scope.row.entryKey}}
		    </template>
		  </el-table-column>
		  <el-table-column label="机型描述" align="center">
		    <template slot-scope="scope">
		      <span>{{scope.row.entryValue}}</span>
		    </template>
		  </el-table-column>
		  <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
		    <template slot-scope="scope">
		      <el-button type="warning" plain size="small" @click="restPassword(scope.row.entryKey)">删除</el-button>
		    </template>
		  </el-table-column>
		</el-table>

		<div class="pagination-container">
		  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15,30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
		  </el-pagination>
		</div>
	</div>
</template>
<script>
import { createMachineModel,deleteMachineModel,getMachineModel,getMachineModelByPage } from '@/api/machineModel'
export default {
  data() {
    const validateRoleCode = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        if (!value) {
          callback(new Error('用户编码不能为空'))
        } else {
          checkCodeIsValid(value).then((data) => {
            if (data) {
              callback()
            } else {
              callback(new Error('用户编码已存在'))
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      listQuery: {
        start: 0,
        length: 15,
        sidx: 'recDate',
        sort: 'desc',
        employeeCode: '',
        userName: ''
      },
      currentPage: 1,
      limit: 15,
      total: null,
      user: {
        employeeCode: '',
        agencyCode: this.$store.getters.agencyCode,
        userId: '',
        userName: '',
        mobile: '',
        gender: '1',
        departmentCode: '',
        roleCodes: '',
        lockStatus: 'N'
      },
      roleCodes: [],
      roles: null,
      depts: null,
      dialogFormVisible: false,
      dialogStatus: '',
      userRules: {
        employeeCode: [{ trigger: 'blur', validator: validateRoleCode }],
        userName: [{ required: true, trigger: 'blur', message: '用户名称不能为空' }],
        departmentCode: [{ required: true, trigger: 'change', message: '部门不能为空' }]
      }
    }
  },
  watch: { roleCodes: function(val) { this.user.roleCodes = val.join(',') } },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalRows
        this.currentPage = response.currentPage
        this.limit = response.pageRecorders
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.start = 0
      this.fetchData()
    },
    resetForm() {
      this.user = {
        employeeCode: '',
        agencyCode: this.$store.getters.agencyCode,
        userId: '',
        userName: '',
        mobile: '',
        gender: '1',
        departmentCode: '',
        roleCodes: '',
        lockStatus: 'N'
      }
    },
    initData(cb) {
      const proms = []
      if (!this.roles) {
        const role = getRoleList({ lockStatus: 'N' }).then((data) => { this.roles = data })
        proms.push(role)
      }
      if (!this.roles) {
        const dept = getDeptList({ start: 0, length: 100, parentCode: '-1' }).then((data) => { this.depts = data.list })
        proms.push(dept)
      }
      if (proms.length) {
        Promise.all(proms).then(v => {
          cb()
        })
      } else {
        cb()
      }
    },
    handleCreate() {
      const $this = this
      this.resetForm()
      this.roleCodes = []
      this.initData(function() {
        $this.dialogStatus = 'create'
        $this.dialogFormVisible = true
        $this.$nextTick(() => {
          $this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDeleteMergeAccount(row) {
      this.$confirm('是否确认解除钉钉绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMergeAccount(row.userId).then(res => {
          this.$notify({
            title: '成功',
            message: '解绑成功',
            type: 'success',
            duration: 2000
          })
          row.isBind = 'N'
        })
      }).catch(() => {})
    },
    handleUpdate(row) {
      const $this = this
      this.user = Object.assign({}, row)
      this.roleCodes = row.roleCodes.split(',')
      this.user.agencyCode = this.$store.getters.agencyCode
      this.initData(function() {
        $this.dialogFormVisible = true
        $this.dialogStatus = 'update'
        $this.$nextTick(() => {
          $this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleLockStatus(row) {
      changeUserStatus(row.userId).then((data) => {
        row.lockStatus = data.lockStatus
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.listQuery.length = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.listQuery.start = (val - 1) * this.limit
      this.fetchData()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.user).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          })
        } else {
          return false
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.user.userId, this.user).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          })
        } else {
          return false
        }
      })
    },
    restPassword(userId) {
      this.$confirm('是否确认重置为默认密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEmployeePassword(userId).then(res => {
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
          if (userId === this.$store.getters.userId) {
            this.$store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
              if (window.yunba) {
                window.yunba.disconnect() // 关闭连接
              }
            })
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
