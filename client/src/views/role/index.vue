<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"  placeholder="角色名称" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.roleName">
      </el-input>
      <el-button class="filter-item" type="primary"  size="medium" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;"  size="medium"  @click="handleCreate"
        type="warning" v-if="operButtons.indexOf('addRole') > -1">新增</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" :height="$store.getters.appHeight - 320" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="角色编码" width="110">
        <template slot-scope="scope">
          {{scope.row.roleCode}}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center">
        <template slot-scope="scope">
          {{scope.row.description}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="锁定状态" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.lockStatus == 'N' ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15,30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogStatus=='create' ? '创建角色' : '编辑角色'" :visible.sync="dialogFormVisible">
      <el-form :rules="roleRules"  ref="dataForm" :model="role" label-position="right" label-width="120px" size="medium">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="role.roleCode" :readonly="dialogStatus!='create'"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" v-model="role.description">
          </el-input>
        </el-form-item>
        <el-form-item label="锁定状态">
          <el-switch
            v-model="role.lockStatus"
            active-color="#409EFF"
            inactive-color="#ff4949"
            active-value="N"
            inactive-value="Y">
          </el-switch>
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
import { getList, createRole, updateRole, deleteRole, checkRoleCodeAvailable } from '@/api/role'
import { objDeepCopy, customizeAssign } from '@/utils/index'
export default {
  name: 'roleTemplate',
  data() {
    const validateRoleCode = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        checkRoleCodeAvailable({ roleCode: value }).then((data) => {
          if (data) {
            callback()
          } else {
            callback(new Error('角色编码已存在'))
          }
        })
      } else {
        callback()
      }
    }
    return {
      list: null,
      operButtons: this.$store.getters.operButtons,
      listLoading: true,
      listQuery: {
        start: 0,
        length: 15,
        roleName: ''
      },
      currentPage: 1,
      limit: 15,
      total: null,
      role: {
        roleCode: '',
        roleName: '',
        description: '',
        lockStatus: 'N'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      roleRules: {
        roleCode: [{ required: true, trigger: 'blur', message: '角色编码不能为空' },
          { validator: validateRoleCode, trigger: 'blur' }
        ],
        roleName: [{ required: true, trigger: 'blur', message: '角色名称不能为空' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() { // 获取角色列表
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.list
        // const produceRecordType = response.list.produceRecordType.split(',')

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
      this.role = {
        roleCode: '',
        roleName: '',
        spuPools: [],
        produceRecordType: [],
        description: '',
        lockStatus: 'N'
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
      customizeAssign(this.role, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      deleteRole([row.roleCode]).then(() => {
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
          const role = objDeepCopy(this.role)
          role.spuPools = role.spuPools.join(',')
          role.produceRecordType = role.produceRecordType.join(',')
          createRole(role).then(() => {
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
          const role = objDeepCopy(this.role)
          updateRole(this.role.roleCode, role).then(() => {
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
