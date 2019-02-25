<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"  placeholder="字段编码" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.columnCode">
      </el-input>
      <el-input @keyup.enter.native="handleFilter"  placeholder="字段名称" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.columnName">
      </el-input>
      <el-button class="filter-item" type="primary"  size="medium" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;"  size="medium"  @click="handleCreate" type="warning">新增</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading"  :height="$store.getters.appHeight - 320" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="字段编码" width="110" prop="columnCode"></el-table-column>
      <el-table-column label="字段名称" align="center" prop="columnName"></el-table-column>
      <el-table-column label="字段类型" align="center" prop="dataType"></el-table-column>
      <el-table-column label="字段长度" align="center" prop="maxLength"></el-table-column>
      <el-table-column label="是否必填" align="center">
        <template slot-scope="scope">
          {{ scope.row.isRequired === 'Y' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="默认值" align="center" prop="defaultValue"></el-table-column>
      <el-table-column label="展示顺序" align="center" prop="displayOrder"></el-table-column>
      <el-table-column align="center" label="操作" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15,30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogStatus=='create' ? '创建字段' : '编辑字段'" :visible.sync="dialogFormVisible" width="600px">
      <el-form :rules="columnRules"  ref="dataForm" :model="column" label-position="right" label-width="100px" size="medium">
        <el-form-item label="字段编码" prop="columnCode">
          <el-input v-model="column.columnCode" :readonly="dialogStatus!='create'"></el-input>
        </el-form-item>
        <el-form-item label="字段名称" prop="columnName">
          <el-input v-model="column.columnName"></el-input>
        </el-form-item>
        <el-form-item label="字段类型" prop="dataType">
          <el-select v-model="column.dataType" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dataTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段长度">
          <el-input v-model="column.maxLength"></el-input>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch v-model="column.isRequired" active-color="#13ce66" inactive-color="#ff4949"
            active-value="Y" inactive-value="N" active-text="是" inactive-text="否"> </el-switch>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input v-model="column.defaultValue"></el-input>
        </el-form-item>
        <el-form-item label="展示顺序">
          <el-input v-model="column.displayOrder"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" size="medium" @click="createData">保存</el-button>
        <el-button v-else type="primary" size="medium" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getColumnList, createColumn, updateColumn, deleteColumn, checkColumnCodeAvailable, getDataTypes } from '@/api/asi'
import { objDeepCopy, customizeAssign } from '@/utils/index'
export default {
  data() {
    const validateColumnCode = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        checkColumnCodeAvailable(this.agencyCode, value).then((data) => {
          if (data) {
            callback()
          } else {
            callback(new Error('字段编码已存在'))
          }
        })
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      agencyCode: this.$store.getters.agencyCode,
      dataTypes: [],
      listQuery: {
        agencyCode: this.$store.getters.agencyCode,
        start: 0,
        length: 15,
        sidx: 'displayOrder',
        sort: 'asc',
        columnCode: '',
        columnName: ''
      },
      currentPage: 1,
      limit: 15,
      total: null,
      column: {
        columnCode: '',
        columnName: '',
        dataType: '',
        maxLength: '',
        isRequired: '',
        defaultValue: '',
        displayOrder: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      columnRules: {
        columnCode: [{ required: true, trigger: 'blur', message: '字段编码不能为空' },
          { validator: validateColumnCode, trigger: 'blur' }],
        columnName: [{ required: true, trigger: 'blur', message: '字段名称不能为空' }],
        dataType: [{ required: true, trigger: 'blur', message: '字段类型不能为空' }]
      }
    }
  },
  created() {
    this.fetchData()
    getDataTypes().then(data => {
      this.dataTypes = data
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getColumnList(this.listQuery).then(response => {
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
      this.column = {
        columnCode: '',
        columnName: '',
        dataType: '',
        maxLength: '',
        isRequired: '',
        defaultValue: '',
        displayOrder: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      customizeAssign(this.column, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      deleteColumn(this.agencyCode, row.columnCode).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
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
          const column = objDeepCopy(this.column)
          createColumn(this.agencyCode, column).then(() => {
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
          const column = objDeepCopy(this.column)
          updateColumn(this.agencyCode, column).then(() => {
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
    }
  }
}
</script>
