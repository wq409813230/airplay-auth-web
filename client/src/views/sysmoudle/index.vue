<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-tree class="filter-tree"
          :data="modulesData"
          :default-expanded-keys="defaultKeys"
          :props="defaultProps"
          node-key="moduleCode"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :highlight-current="true"
          accordion
          ref="moduleTree">
            <span class="module-tree-node" slot-scope="{ node, data }">
              <span>{{ data.moduleName }}</span>
              <span>
                <el-button
                  v-if="data.levelNum !== 3"
                  type="text"
                  size="mini"
                  @click="() => handleCreateModule(data)">
                  添加
                </el-button>
                <el-button
                  v-if="data.moduleCode !== 'root'"
                  type="text"
                  size="mini"
                  @click="() => handleUpdateModule(node, data)">
                  编辑
                </el-button>
                <el-button
                  v-if="data.moduleCode !== 'root' && data.children.length === 0"
                  type="text"
                  size="mini"
                  @click="() => handleDeleteModule(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="grid-content">
          <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px" size="medium" :disabled="!currentOperateModule || currentOperateModule.levelNum !== 3"
              @click="handleButtonCreate" type="warning">新增按钮</el-button>
          </div>
          <el-table :data="list" :height="$store.getters.appHeight - 320" v-loading.body="listLoading" element-loading-text="Loading"
            border fit highlight-current-row>
            <el-table-column align="center" label='序号' width="80">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column label="按钮编码" prop="buttonCode" width="200"> </el-table-column>
            <el-table-column label="按钮名称" prop="buttonName" width="400"> </el-table-column>
            <el-table-column label="操作" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="handleButtonUpdate(scope.row)">编辑</el-button>
                <el-button type="warning" plain size="mini" @click="handleButtonDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination @current-change="" :current-page="currentPage" :page-sizes="[15,30,50]"
              :page-size="limit" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="dialogStatus=='create' ? '创建按钮' : '编辑按钮'" :visible.sync="dialogFormVisible">
      <el-form :rules="buttonRules" ref="buttonForm" :model="btnObj" label-position="right" label-width="120px" size="medium">
        <el-row :gutter="40">
          <el-col :span="11">
            <el-form-item label="按钮编码" prop="buttonCode">
              <el-input v-model="btnObj.buttonCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="按钮名称" prop="buttonName">
              <el-input v-model="btnObj.buttonName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="11">
            <el-form-item label="按钮类型">
              <el-radio v-model="btnObj.buttonType" label="API">API</el-radio>
              <el-radio v-model="btnObj.buttonType" label="WEB">WEB</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="按钮样式">
              <el-select v-model="btnObj.buttonStyle" placeholder="请选择" style="width: 100%;">
                <el-option key="button" label="按钮" value="button"></el-option>
                <!-- <el-option key="link" label="链接" value="link"></el-option>
                <el-option key="tab" label="标签页" value="tab"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <resource-allot :data="operations" :code="currentOperateModule.moduleCode" 
        :hasSelectedFuncId="btnObj.funcId" :hasSelectedResId="btnObj.extend1" @selectChange="selectChange"></resource-allot>
      <div style="text-align: right;margin-top: 20px;">
        <el-button v-if="dialogStatus=='create'" type="primary" size="medium" @click="createButtonData">保存</el-button>
        <el-button v-else type="primary" size="medium" @click="updateButtonData">保存</el-button>
        <el-button size="medium" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogModuleStatus=='create' ? '创建模块' : '编辑模块'" :visible.sync="dialogModuleFormVisible">
      <el-form :rules="moduleRules" ref="moduleForm" :model="module" label-position="right" label-width="100px" size="medium">
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item label="父模块">
              <el-input v-model="parentModuleName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块编码" prop="moduleCode">
              <el-input v-model="module.moduleCode" :readonly="dialogStatus == 'update'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model="module.moduleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块路径" prop="direction">
              <el-input v-model="module.direction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item label="模块顺序" prop="orderNum">
              <el-input v-model.number="module.orderNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块类型">
              <el-select v-model="module.moduleType"  style="width:100%;">
                <el-option label="菜单" value="menu"> </el-option>
                <el-option label="TAB" value="tab"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item label="子内容类型" >
              <el-select v-model="module.childContentType"  style="width:100%;">
                <el-option label="模块" value="module"> </el-option>
                <el-option label="按钮" value="button"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家是否可用">
              <el-switch v-model="module.isAgencyTemplate" active-text="可用" inactive-text="不可用" 
                active-value="Y" inactive-value="N"> </el-switch> 
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogModuleStatus=='create'" type="primary" size="medium" @click="createModuleData">保存</el-button>
        <el-button v-else type="primary" size="medium" @click="updateModuleData">保存</el-button>
        <el-button size="medium" @click="dialogModuleFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { createModule, updateModule, getModulesTree, deleteModule, getOperations, getModuleBtnList, createModuleBtn,
  checkButtonCodeAvailable, deleteModuleBtn, updateModuleBtn } from '@/api/sysmodule'
import resourceAllot from './resourceAllot'
import { validateCode } from '@/utils/validate'
import { customizeAssign } from '@/utils/index'
export default {
  components: { resourceAllot },
  data() {
    const validateModuleCode = (rule, value, callback) => {
      if (!validateCode(value)) {
        callback(new Error('模块编码只能为大小写字母及数字下划线'))
      } else {
        callback()
      }
    }
    const validateButtonCode = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        if (!value) {
          callback(new Error('按钮编码不能为空'))
        } else {
          checkButtonCodeAvailable({
            agencyCode: this.btnObj.agencyCode,
            moduleCode: this.btnObj.moduleCode,
            buttonCode: this.btnObj.buttonCode
          }).then((data) => {
            if (data) {
              callback()
            } else {
              callback(new Error('按钮编码已存在'))
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      agencyCode: this.$store.getters.agencyCode,
      modulesData: [],
      defaultKeys: [],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      list: null,
      listQuery: {
        start: 0,
        length: 15,
        agencyCode: this.$store.getters.agencyCode,
        moduleCode: '',
        buttonName: ''
      },
      currentPage: 1,
      limit: 15,
      total: null,
      dialogFormVisible: false,
      dialogStatus: '',
      operations: [],
      btnObj: {
        agencyCode: this.$store.getters.agencyCode,
        moduleCode: '',
        buttonCode: '',
        buttonName: '',
        buttonStyle: 'button',
        buttonType: 'API',
        funcId: '',
        extend1: '', // 暂存resourceCode用于编辑时默认展开子列表
        sequenceNBR: ''
      },
      parentModuleName: '',
      currentOperateModule: '', // 当前操作模块
      module: {
        agencyCode: this.$store.getters.agencyCode,
        moduleCode: '',
        moduleName: '',
        parentCode: '',
        levelNum: '',
        moduleType: 'menu',
        direction: '',
        orderNum: '',
        childContentType: 'module',
        isAgencyTemplate: 'Y',
        sequenceNBR: ''
      },
      dialogModuleStatus: '',
      dialogModuleFormVisible: false,
      moduleRules: {
        moduleCode: [{ required: true, trigger: 'blur', message: '模块编码不能为空' },
          { validator: validateModuleCode, trigger: 'blur' }],
        moduleName: [{ required: true, trigger: 'blur', message: '模块名称不能为空' }],
        orderNum: [{ required: true, trigger: 'blur', message: '模块顺序不能为空' },
          { type: 'number', trigger: 'blur', message: '模块顺序只能为数字值' }]
      },
      buttonRules: {
        buttonCode: [{ required: true, trigger: 'blur', message: '按钮编码不能为空' },
          { validator: validateButtonCode, trigger: 'blur' }],
        buttonName: [{ required: true, trigger: 'blur', message: '按钮名称不能为空' }]
      }
    }
  },
  created() {
    this.getModulesTree()
  },
  methods: {
    getModulesTree() {
      this.listLoading = true
      getModulesTree(this.agencyCode).then((data) => {
        this.modulesData = [data]
        this.defaultKeys = [data.children[0].moduleCode]
        this.listLoading = false
      })
    },
    fetchBtnList() {
      this.listLoading = true
      getModuleBtnList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.totalRows
        this.currentPage = data.currentPage
        this.limit = data.pageRecorders
        this.listLoading = false
      })
    },
    handleNodeClick(data, node, c) {
      this.currentOperateModule = data
      if (data.levelNum === 3) {
        this.listQuery.moduleCode = node.key
        this.listQuery.start = 0
        this.fetchBtnList()
      }
    },
    resetModuleForm() {
      this.module = {
        agencyCode: this.agencyCode,
        moduleCode: '',
        moduleName: '',
        parentCode: '',
        levelNum: '',
        moduleType: 'menu',
        direction: '',
        orderNum: '',
        childContentType: 'module',
        isAgencyTemplate: 'Y',
        sequenceNBR: ''
      }
    },
    handleCreateModule(data) {
      this.resetModuleForm()
      this.currentOperateModule = data
      this.parentModuleName = data.moduleName
      this.module.parentCode = data.moduleCode
      this.module.levelNum = data.moduleCode === 'root' ? 1 : data.levelNum + 1
      this.dialogModuleStatus = 'create'
      this.dialogModuleFormVisible = true
      this.$nextTick(() => {
        this.$refs['moduleForm'].clearValidate()
      })
    },
    handleUpdateModule(node, data) {
      this.resetModuleForm()
      this.currentOperateModule = data
      this.parentModuleName = node.parent.label
      customizeAssign(this.module, data)
      this.dialogModuleStatus = 'update'
      this.dialogModuleFormVisible = true
      this.$nextTick(() => {
        this.$refs['moduleForm'].clearValidate()
      })
    },
    handleDeleteModule(node, data) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModule(this.agencyCode, [data.moduleCode]).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.$refs.moduleTree.remove(data.moduleCode)
        })
      }).catch(() => {
        return
      })
    },
    createModuleData() {
      this.$refs['moduleForm'].validate((valid) => {
        if (valid) {
          createModule(this.module).then((response) => {
            this.dialogModuleFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.currentOperateModule.children.push(response)
          })
        } else {
          return false
        }
      })
    },
    updateModuleData() {
      this.$refs['moduleForm'].validate((valid) => {
        if (valid) {
          updateModule(this.agencyCode, this.module.moduleCode, this.module).then((response) => {
            this.dialogModuleFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            Object.assign(this.currentOperateModule, { moduleCode: response.moduleCode, moduleName: response.moduleName, direction: response.direction,
              orderNum: response.orderNum, moduleType: response.moduleType, childContentType: response.childContentType, isAgencyTemplate: response.isAgencyTemplate })
            // this.currentOperateModule = { ...this.currentOperateModule, moduleCode: response.moduleCode, moduleName: response.moduleName, direction: response.direction,
              // levelNum: response.levelNum, moduleType: response.moduleType, childContentType: response.childContentType, isAgencyTemplate: response.isAgencyTemplate }
            console.log(this.modulesData)
          })
        } else {
          return false
        }
      })
    },
    fetchResource(moduleCode) { // 获取资源
      this.dialogStatus = 'create'
      if (!this.operations.length) { // 操作数据是相同的 获取一次后就不再重新获取
        getOperations().then((data) => {
          this.operations = data.map(v => {
            return { 'resourceCode': v[0], 'resourceName': v[1], 'operations': v[2] }
          })
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['buttonForm'].clearValidate()
          })
        })
      } else {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['buttonForm'].clearValidate()
        })
      }
    },
    selectChange(data) {
      if (data) {
        this.btnObj.extend1 = data.resourceCode
        this.btnObj.funcId = data.funcId
      } else {
        this.btnObj.extend1 = ''
        this.btnObj.funcId = ''
      }
    },
    resetButtonForm() {
      this.btnObj = {
        agencyCode: this.$store.getters.agencyCode,
        moduleCode: this.currentOperateModule.moduleCode,
        buttonCode: '',
        buttonName: '',
        buttonStyle: 'button',
        buttonType: 'API',
        funcId: '',
        extend1: '', // 暂存resourceCode用于编辑时默认展开子列表
        sequenceNBR: ''
      }
    },
    handleButtonCreate() {
      this.dialogStatus = 'create'
      this.resetButtonForm()
      this.fetchResource(this.currentOperateModule.moduleCode)
    },
    createButtonData() { // 按钮创建事件
      if (this.btnObj.buttonType === 'WEB') {
        this.btnObj.funcId = 'WEB0001'
        this.btnObj.extend1 = ''
      }
      if (!this.btnObj.funcId) {
        this.$message.error('请给按钮分配资源')
      } else {
        createModuleBtn(this.btnObj).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.fetchBtnList()
        })
      }
    },
    handleButtonUpdate(row) {
      this.dialogStatus = 'update'
      customizeAssign(this.btnObj, row)
      if (!this.operations.length) {
        getOperations().then((data) => {
          this.operations = data.map(v => {
            return { 'resourceCode': v[0], 'resourceName': v[1], 'operations': v[2] }
          })
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['buttonForm'].clearValidate()
          })
        })
      } else {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['buttonForm'].clearValidate()
        })
      }
    },
    updateButtonData() {
      if (this.btnObj.buttonType === 'WEB') {
        this.btnObj.funcId = 'WEB0001'
        this.btnObj.extend1 = ''
      }
      if (!this.btnObj.funcId) {
        this.$message.error('请给按钮分配资源')
      } else {
        updateModuleBtn(this.btnObj.sequenceNBR, this.btnObj).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.fetchBtnList()
        })
      }
    },
    handleButtonDelete(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModuleBtn(row.sequenceNBR).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {
        return
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .module-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>