<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"  placeholder="机型" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.machineModel"></el-input>
      <el-input @keyup.enter.native="handleFilter"  placeholder="公司" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.companyName"></el-input>
      <el-button v-if="operButtons.indexOf('queryAuthConfig') > -1" class="filter-item" type="primary"  size="medium" @click="handleFilter">搜索</el-button>
      <el-button v-if="operButtons.indexOf('addAuthConfig') > -1" class="filter-item" style="margin-left: 10px;"  size="medium"  @click="handleCreate" type="warning" >新增</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" :height="$store.getters.appHeight - 320" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="机型编码" width="110">
        <template slot-scope="scope">
          {{scope.row.machineModel}}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="密钥" align="center">
        <template slot-scope="scope">
          {{scope.row.privateKey}}
        </template>
      </el-table-column>
      <el-table-column label="最大授权数量" align="center">
        <template slot-scope="scope">
          {{scope.row.maxAuthCount}}
        </template>
      </el-table-column>
      <el-table-column label="已授权数量" align="center">
        <template slot-scope="scope">
          {{scope.row.authedCount}}
        </template>
      </el-table-column>
      <el-table-column label="授权时间" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{mm}:{ss}')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="operButtons.indexOf('editAuthConfig') > -1" type="primary" plain size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="operButtons.indexOf('deleteAuthConfig') > -1" type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15,30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogStatus=='create' ? '创建授权' : '编辑授权'" :visible.sync="dialogFormVisible">
      <el-form :rules="authConfigRules"  ref="dataForm" :model="authConfig" label-position="right" label-width="120px" size="medium">
        <el-form-item label="机型编码" prop="machineModel">
          <el-select v-model="authConfig.machineModel"  placeholder="请选择" style="width:100%;" :disabled="dialogStatus!='create'">
            <el-option
              v-for="machineModel in machineModels"
              :key="machineModel.entryKey"
              :label="machineModel.entryKey"
              :value="machineModel.entryKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="authConfig.companyName" :disabled="dialogStatus!='create'"></el-input>
        </el-form-item>
        <el-form-item label="密钥">
          <el-input type="textarea" v-model="authConfig.privateKey" prop="privateKey">
          </el-input>
        </el-form-item>
        <el-form-item label="最大授权数量" prop="maxAuthCount">
          <el-input v-model="authConfig.maxAuthCount"></el-input>
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
  import { objDeepCopy, customizeAssign } from '@/utils/index'
  import { createAuthConfig, deleteAuthConfig, updateAuthConfig, getAuthConfigByPage } from '@/api/authconfig'
  import { getMachineModelByPage } from '@/api/machinemodel'
  export default {
    name: 'authConfigTemplate',
    data() {
      return {
        list: null,
        operButtons: this.$store.getters.operButtons,
        listLoading: true,
        listQuery: {
          start: 0,
          length: 15,
          machineModel: '',
          companyName: ''
        },
        currentPage: 1,
        limit: 15,
        total: null,
        authConfig: {
          sequenceNBR: '',
          machineModel: '',
          companyName: '',
          privateKey: '',
          maxAuthCount: '0'
        },
        machineModels: null,
        dialogFormVisible: false,
        dialogStatus: '',
        authConfigRules: {
          machineModel: [{ required: true, trigger: 'blur', message: '机型不能为空' }],
          companyName: [{ required: true, trigger: 'blur', message: '公司不能为空' }],
          privateKey: [{ required: true, trigger: 'blur', message: '密钥不能为空' }],
          maxAuthCount: [{ required: true, trigger: 'blur', message: '最大授权数量不能为空' }]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getAuthConfigByPage(this.listQuery).then(response => {
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
        this.authConfig = {
          sequenceNBR: '',
          machineModel: '',
          companyName: '',
          privateKey: '',
          maxAuthCount: '0'
        }
      },
      initData(cb) {
        const proms = []
        if (!this.machineModels) {
          const machineModels = getMachineModelByPage({ start: 0, length: 100 }).then((data) => { this.machineModels = data.list })
          proms.push(machineModels)
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
        var self = this
        this.resetForm()
        this.initData(function() {
          self.dialogStatus = 'create'
          self.dialogFormVisible = true
          self.$nextTick(() => {
            self.$refs['dataForm'].clearValidate()
          })
        })
      },
      handleUpdate(row) {
        var self = this
        customizeAssign(this.authConfig, row)
        this.initData(function() {
          self.dialogStatus = 'update'
          self.dialogFormVisible = true
          self.$nextTick(() => {
            self.$refs['dataForm'].clearValidate()
          })
        })
      },
      handleDelete(row) {
        var self = this
        self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAuthConfig([row.sequenceNBR]).then(() => {
            self.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = self.list.indexOf(row)
            self.list.splice(index, 1)
          })
        }).catch(() => {
          return
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
            const authConfig = objDeepCopy(this.authConfig)
            createAuthConfig(authConfig).then(() => {
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
            const authConfig = objDeepCopy(this.authConfig)
            updateAuthConfig(this.authConfig.sequenceNBR, authConfig).then(() => {
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
