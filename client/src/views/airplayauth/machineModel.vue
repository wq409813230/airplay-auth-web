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
          <el-button v-if="!scope.row.sequenceNBR || scope.row.edit" type="text" @click="createMachineModel(scope.row)" size="small">保存</el-button>
		      <el-button type="warning" plain size="small" @click="deleteMachineModel(scope.row.entryKey)">删除</el-button>
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
import { createMachineModel, deleteMachineModel, getMachineModelByPage } from '@/api/machinemodel'
export default {
  data() {
    const validateModelCode = (code, cb) => {

    }
    return {
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
        entryKey: [{ trigger: 'blur', validator: validateModelCode }]
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
      createMachineModel(row)
    },
    deleteMachineModel(modelCode) {
      deleteMachineModel(modelCode)
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
