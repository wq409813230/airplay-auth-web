<template>
	<div class="app-container">
		<div class="filter-container">
	      <el-input @keyup.enter.native="handleFilter"  placeholder="机型名称" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.modelCode">
	      </el-input>
	      <el-button v-if="operButtons.indexOf('queryMachineModel') > -1" class="filter-item" type="primary"  size="medium" @click="handleFilter">查询</el-button>
	      <el-button v-if="operButtons.indexOf('addMachineModel') > -1" class="filter-item" style="margin-left: 10px;"  size="medium"  @click="handleCreate" type="warning">新增</el-button>
	  </div>
		<el-table :data="list" :height="$store.getters.appHeight - 320" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
		  <el-table-column align="center" label='ID' width="95" type="index" />
		  <el-table-column label="机型名称" width="110">
		    <template slot-scope="scope">
          <template v-if="scope.row.sequenceNBR">{{ scope.row.entryKey }}</template>
          <span v-else>
            <el-input class="edit-input" size="small" v-model="scope.row.entryKey"></el-input>
            <span class="warning-info">{{ machineModelRules.entryKey.message }}</span>
          </span>
		    </template>
		  </el-table-column>
		  <el-table-column label="机型描述" align="center">
		    <template slot-scope="scope">
          <template v-if="scope.row.sequenceNBR">{{ scope.row.entryValue }}</template>
          <span v-else>
            <el-input class="edit-input" size="small" v-model="scope.row.entryValue"></el-input>
            <span class="warning-info">{{ machineModelRules.entryValue.message }}</span>
          </span>
        </template>
		  </el-table-column>
		  <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
		    <template slot-scope="scope">
          <el-button v-if="!scope.row.sequenceNBR || scope.row.edit" type="primary" plain @click="createMachineModel(scope.row)" size="small">保存</el-button>
		      <el-button v-if="operButtons.indexOf('deleteMachineModel') > -1" type="warning" plain size="small" @click="deleteMachineModel(scope.row.entryKey)">删除</el-button>
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
import { createMachineModel, deleteMachineModel, getMachineModelByPage, getMachineModel } from '@/api/machinemodel'
export default {
  data() {
    const validateModelCode = (entryKey, cb) => {
      this.machineModelRules.entryKey.message = ''
      if (!entryKey) {
        this.machineModelRules.entryKey.message = '机型不能为空'
        cb(false)
      } else {
        getMachineModel(entryKey).then((data) => {
          if (data) {
            this.machineModelRules.entryKey.message = '机型已经存在'
            cb(false)
          } else {
            cb(true)
          }
        })
      }
    }
    const validateModelDesc = (entryValue) => {
      this.machineModelRules.entryValue.message = ''
      if (!entryValue) {
        this.machineModelRules.entryValue.message = '机型描述不能为空'
        return false
      }
      return true
    }
    return {
      operButtons: this.$store.getters.operButtons,
      list: null,
      listLoading: true,
      listQuery: {
        start: 0,
        length: 15,
        sidx: 'recDate',
        sort: 'desc',
        modelCode: ''
      },
      currentPage: 1,
      limit: 15,
      total: null,
      machineModel: {
        dictCode: '',
        entryKey: '',
        entryValue: '',
        lockStatus: 'N'
      },
      machineModelRules: {
        entryKey: { validate: validateModelCode, message: '' },
        entryValue: { validate: validateModelDesc, message: '' }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMachineModelByPage(this.listQuery).then(response => {
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
    resetMachineModelValidator() {
      this.machineModelRules['entryKey'].message = ''
      this.machineModelRules['entryValue'].message = ''
    },
    handleCreate() { // 新增字典
      var addRow = {
        entryKey: '',
        entryValue: ''
      }
      this.resetMachineModelValidator()
      this.list.splice(0, 0, addRow)
    },
    createMachineModel(row) {
      var self = this
      var valueExists = self.machineModelRules['entryValue'].validate(row.entryValue)
      self.machineModelRules['entryKey'].validate(row.entryKey, function(valid) {
        if (valid && valueExists) {
          createMachineModel(row).then((data) => {
            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            self.fetchData()
          })
        }
      })
    },
    deleteMachineModel(modelCode) {
      var self = this
      if (modelCode) {
        self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMachineModel(modelCode).then(() => {
            self.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            self.fetchData()
          })
        }).catch(() => {
          return
        })
      }
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
