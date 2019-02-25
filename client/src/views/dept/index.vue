<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-tree class="filter-tree"
            :data="data2"
            :props="defaultProps"
            node-key="departmentCode"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            :highlight-current="true"
            default-expand-all  ref="deptTree"></el-tree></div>
      </el-col>
      <el-col :span="19">
        <div class="grid-content">
          <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" size="medium"  @click="handleCreate" type="warning">新增</el-button>
          </div>
          <el-table :data="list"  :height="$store.getters.appHeight - 320" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
              <template slot-scope="scope">
                {{scope.$index}}
              </template>
            </el-table-column>
            <el-table-column label="部门编码" prop="departmentCode" width="110"> </el-table-column>
            <el-table-column label="部门名称" prop="departmentName" align="center"> </el-table-column>
            <el-table-column label="锁定状态" width="100" align="center">
              <template slot-scope="scope">
                {{scope.row.lockStatus == 'N' ? '启用' : '禁用'}}
              </template>
            </el-table-column>
            <el-table-column label="说明" prop="description" align="center"></el-table-column>
            <el-table-column align="center" label="操作" width="260" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" plain size="small" @click="handleLockStatus(scope.row)">
          {{scope.row.lockStatus == 'N' ? '禁用' : '启用'}}</el-button>
                <el-button type="danger" plain size="small" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15,30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
          <el-dialog :title="dialogStatus=='create' ? '创建部门' : '编辑部门'"  custom-class="small" :visible.sync="dialogFormVisible">
            <el-form :rules="validateRules"  ref="dataForm" :model="dept" label-position="right" label-width="80px" size="medium">
              <el-form-item label="部门编码" prop="departmentCode">
                <el-input v-model="dept.departmentCode"></el-input>
                <el-input type="hidden" v-model="dept.parentCode" style="display:none"></el-input>
              </el-form-item>
              <el-form-item label="部门名称" prop="departmentName">
                <el-input v-model="dept.departmentName"></el-input>
              </el-form-item>
              <el-form-item label="说明">
                <el-input type="textarea" v-model="dept.description">
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="medium" @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" size="medium" @click="createData" :loading="saveLoading">保存</el-button>
              <el-button v-else type="primary" size="medium" @click="updateData">保存</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { deptTree, getList, createDept, updateDept, deleteDept, changeDeptStatus } from '@/api/dept'
export default {
  data() {
    return {
      treeParams: {
        agencyCode: this.$store.getters.agencyCode,
        parentCode: ''
      },
      currentNodeCode: '-1', // 当前点击选中树节点
      list: null,
      listLoading: true,
      listQuery: {
        start: 0,
        length: 15,
        parentCode: '-1'
      },
      currentPage: 1,
      limit: 15,
      total: null,
      dept: {
        parentCode: '-1',
        departmentCode: '',
        departmentName: '',
        description: ''
      },
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      validateRules: {
        departmentCode: [{ required: true, trigger: 'blur', message: '部门编码不能为空' }],
        departmentName: [{ required: true, trigger: 'blur', message: '部门名称不能为空' }]
      },
      saveLoading: false
    }
  },
  watch: {
    currentNodeCode: function(val) {
      this.listQuery.parentCode = val
      this.dept.parentCode = val
    }
  },
  created() {
    this.getDeptTree()
    this.fetchData()
  },
  methods: {
    getDeptTree() {
      this.listLoading = true
      deptTree(this.treeParams).then(response => {
        this.listLoading = false
        this.data2 = [response]
      })
    },
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
    handleNodeClick(data, node, c) {
      this.currentNodeCode = node.key
      this.listQuery.parentCode = node.key
      this.listQuery.start = 0
      this.fetchData()
    },
    resetFrom() {
      this.dept = {
        parentCode: this.currentNodeCode,
        departmentCode: '',
        departmentName: '',
        description: ''
      }
    },
    handleCreate() {
      this.resetFrom()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.saveLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.dept = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleLockStatus(row) {
      changeDeptStatus(row.departmentCode).then(() => {
        this.fetchData()
      })
    },
    handleDelete(row) {
      deleteDept([row.departmentCode]).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.$refs['deptTree'].remove(row.departmentCode)
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
          this.saveLoading = true
          createDept(this.dept).then((data) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['deptTree'].append(data, this.currentNodeCode)
            this.fetchData()
          })
        } else {
          return false
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateDept(this.dept.departmentCode, this.dept).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

