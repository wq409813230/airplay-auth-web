<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-tree class="filter-tree"
            :data="groupTreeData"
            :props="defaultProps"
            node-key="groupCode"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            :highlight-current="true"
            :default-expanded-keys="['GROUP.ROOT']"
            ref="groupTree"></el-tree></div>
      </el-col>
      <el-col :span="19">
        <div class="grid-content">
          <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;"  size="medium"  @click="handleCreate" type="warning">新增</el-button>
          </div>
          <el-table :data="list" v-loading.body="listLoading" :height="$store.getters.appHeight - 320" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
              <template slot-scope="scope">
                {{scope.$index}}
              </template>
            </el-table-column>
            <el-table-column label="分组编码" prop="groupCode" width="110"> </el-table-column>
            <el-table-column label="分组名称" prop="groupName" align="center"> </el-table-column>
            <el-table-column label="父分组编码" prop="parentGroupCode" align="center"> </el-table-column>
            <el-table-column label="分组类型" prop="groupType" align="center"></el-table-column>
            <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
                <el-button type="primary" plain size="mini" @click="handleEditColumn(scope.row)">字段管理</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination layout="total" :total="total">
            </el-pagination>
          </div>
          <el-dialog :title="dialogStatus=='create' ? '创建分组' : '编辑分组'" :visible.sync="dialogFormVisible" width="600px">
            <el-form :rules="validateRules"  ref="dataForm" :model="group" label-position="right" label-width="80px" size="medium">
              <el-form-item label="分组编码" prop="groupCode">
                <el-input v-model="group.groupCode"></el-input>
                <el-input type="hidden" v-model="group.parentGroupCode" style="display:none"></el-input>
                <el-input type="hidden" v-model="group.nodeLevel" style="display: none"></el-input>
              </el-form-item>
              <el-form-item label="分组名称" prop="groupName">
                <el-input v-model="group.groupName"></el-input>
              </el-form-item>
              <el-form-item label="分组顺序" prop="groupOrder">
                <el-input v-model="group.groupOrder"></el-input>
              </el-form-item>
              <el-form-item label="分组类型" prop="groupType">
                <el-select v-model="group.groupType" placeholder="请选择" style="width: 100%">
                  <el-option label="表单" value="FORM"></el-option>
                  <el-option label="表格" value="TABLE"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="medium" @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" size="medium" @click="createData" :loading="saveLoading">保存</el-button>
              <el-button v-else type="primary" size="medium" @click="updateData">保存</el-button>
            </div>
          </el-dialog>

          <el-dialog title="分组字段管理" :visible.sync="dialogColFormVisible">
            <el-tabs type="border-card"  v-model="tabName">
              <el-tab-pane label="自定义" name="custom" style="height: 260px;">
                <el-form :rules="columnRules"  ref="columnForm" :model="column"  label-position="right" label-width="80px" size="medium">
                  <el-row :gutter="36">
                    <el-col :span="12">
                      <el-form-item label="字段编码" prop="columnCode">
                        <el-input v-model="column.columnCode" :readonly="columnStatus === 'update'"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="字段名称" prop="columnName">
                        <el-input v-model="column.columnName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="36">
                    <el-col :span="12">
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
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="字段长度">
                        <el-input v-model="column.maxLength"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="36">
                    <el-col :span="12">
                      <el-form-item label="展示顺序">
                        <el-input v-model="column.displayOrder"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="默认值">
                        <el-input v-model="column.defaultValue"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="36">
                    <el-col :span="12">
                      <el-form-item label="是否必填">
                        <el-switch v-model="column.isRequired" active-color="#13ce66" inactive-color="#ff4949"
                          active-value="Y" inactive-value="N" active-text="是" inactive-text="否"> </el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div style="text-align: right;"><el-button type="primary" size="medium" @click="createCustomColumn">保存</el-button></div>
              </el-tab-pane>
              <el-tab-pane label="模板库" name="template" style="height: 260px;">
                <div class="filter-container">
                  <el-input @keyup.enter.native="handleColsFilter"  placeholder="字段编码" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.columnCode">
                  </el-input>
                  <el-input @keyup.enter.native="handleColsFilter"  placeholder="字段名称" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.columnName">
                  </el-input>
                  <el-button class="filter-item" type="primary" size="medium" @click="handleColsFilter">搜索</el-button>
                  <el-button class="filter-item" type="warning" size="medium" @click="handleCopyCols">添加到分组</el-button>
                </div>
                <el-table :data="columnList" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @selection-change="handleColsChange" ref="tempColumn">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column align="center" label='ID' width="95">
                    <template slot-scope="scope">
                      {{scope.$index}}
                    </template>
                  </el-table-column>
                  <el-table-column label="字段编码" prop="columnCode"></el-table-column>
                  <el-table-column label="字段名称" align="center" prop="columnName"></el-table-column>
                  <el-table-column label="字段类型" align="center" prop="dataType"></el-table-column>
                  <el-table-column label="字段长度" align="center" prop="maxLength"></el-table-column>
                  <el-table-column label="是否必填" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.isRequired === 'Y' ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="展示顺序" align="center" prop="displayOrder"></el-table-column>
                  <el-table-column label="默认值" align="center" prop="defaultValue"></el-table-column>
                </el-table>
                <div class="pagination-container">
                  <el-pagination @size-change="handleColsSizeChange" @current-change="handleColsCurrentChange" :current-page="columnPage.currentPage" :page-sizes="[15,30, 50]" :page-size="columnPage.limit" layout="total, sizes, prev, pager, next, jumper" :total="columnPage.total">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-table :data="groupColList" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row style="margin-top: 20px;">
              <el-table-column label="展示顺序" prop="displayOrder"></el-table-column>
              <el-table-column label="字段编码" prop="columnCode"></el-table-column>
              <el-table-column label="字段名称" align="center" prop="columnName"></el-table-column>
              <el-table-column label="关联商品库" align="center" prop="dataType"></el-table-column>
              <el-table-column label="字段长度" align="center" prop="maxLength"></el-table-column>
              <el-table-column label="是否必填" align="center">
                <template slot-scope="scope">
                  {{ scope.row.isRequired === 'Y' ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column label="默认值" align="center" prop="defaultValue"></el-table-column>
              <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleGroupColUpdate(scope.row)">编辑</el-button>
                  <el-button type="danger"  size="mini" @click="handleGroupColDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination layout="total" :total="groupColTotal">
              </el-pagination>
            </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getGroupTree, getGroupList, createGroup, updateGroup, deleteGroup, getDataTypes, getColumnList, getGroupColumnList,
  copyTemplateColumn, createGroupColumn, deleteGroupColumn, checkGroupColumnAvailable } from '@/api/asi'
import { customizeAssign } from '@/utils'
export default {
  data() {
    const validateColumnCode = (rule, value, callback) => {
      if (this.columnStatus === 'create') {
        checkGroupColumnAvailable(this.agencyCode, this.currentRow.groupCode, value).then((data) => {
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
      treeParams: {
        agencyCode: this.$store.getters.agencyCode,
        parentCode: 'GROUP.ROOT'
      },
      agencyCode: this.$store.getters.agencyCode,
      currentNodeCode: 'GROUP.ROOT', // 当前点击选中树节点
      list: null,
      listLoading: true,
      total: null,
      group: {
        parentGroupCode: 'GROUP.ROOT',
        nodeLevel: 1,
        groupCode: '',
        groupName: '',
        groupOrder: null,
        groupType: ''
      },
      groupTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'groupName'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      validateRules: {
        groupCode: [{ required: true, trigger: 'blur', message: '分组编码不能为空' }],
        groupName: [{ required: true, trigger: 'blur', message: '分组名称不能为空' }],
        dataType: [{ required: true, trigger: 'blur', message: '字段类型不能为空' }]
      },
      currentRow: null,
      dialogColFormVisible: false, // 分组字段管理弹出框
      dataTypes: [],
      tabName: 'custom',
      columnStatus: 'create', // 区分当前字段是新增还是编辑
      column: {
        columnCode: '',
        columnName: '',
        dataType: '',
        maxLength: '',
        isRequired: '',
        defaultValue: '',
        displayOrder: ''
      },
      columnList: null,
      listQuery: {
        agencyCode: this.$store.getters.agencyCode,
        start: 0,
        length: 15,
        sidx: 'displayOrder',
        sort: 'asc',
        columnCode: '',
        columnName: ''
      },
      columnPage: {
        currentPage: 1,
        limit: 15,
        total: null
      },
      colsSelArr: [],
      groupColList: null,
      groupColTotal: null,
      columnRules: {
        columnCode: [{ required: true, trigger: 'blur', message: '字段编码不能为空' },
          { validator: validateColumnCode, trigger: 'blur' }],
        columnName: [{ required: true, trigger: 'blur', message: '字段名称不能为空' }],
        dataType: [{ required: true, trigger: 'blur', message: '字段类型不能为空' }]
      },
      saveLoading: false
    }
  },
  watch: {
    currentNodeCode: function(val) {
      this.group.parentGroupCode = val
    }
  },
  created() {
    this.getGroupTree()
    this.fetchData()
  },
  methods: {
    getGroupTree() {
      this.listLoading = true
      getGroupTree(this.treeParams).then(response => {
        this.listLoading = false
        this.groupTreeData = [response]
      })
    },
    fetchData() {
      this.listLoading = true
      getGroupList(this.treeParams).then(response => {
        this.list = response
        this.total = this.list.length
        this.listLoading = false
      })
    },
    handleNodeClick(data, node, c) {
      this.currentNodeCode = node.key
      this.group.nodeLevel = data.nodeLevel + 1
      this.treeParams.parentCode = node.key
      this.fetchData()
    },
    resetFrom() {
      this.group = {
        parentGroupCode: this.group.parentGroupCode,
        nodeLevel: this.group.nodeLevel,
        groupCode: '',
        groupName: '',
        groupOrder: '',
        groupType: ''
      }
    },
    resetColumnForm() {
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
      this.resetFrom()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.saveLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      customizeAssign(this.group, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      deleteGroup(this.agencyCode, row.groupCode).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.$refs['groupTree'].remove(row.groupCode)
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    handleEditColumn(row) { // 字段管理
      if (this.dataTypes.length === 0) {
        getDataTypes().then(data => {
          this.dataTypes = data
        })
      }
      if (!this.columnList) {
        this.handleColsFilter()
      }
      this.currentRow = row
      this.tabName = 'custom'
      this.dialogColFormVisible = true
      this.columnStatus = 'create'
      this.$nextTick(() => {
        this.$refs['columnForm'].clearValidate()
        this.$refs['tempColumn'].clearSelection()
      })
      this.fetchGroupColsData(row.groupCode)
    },
    fetchGroupColsData(groupCode) {
      getGroupColumnList(this.agencyCode, groupCode).then(data => {
        this.groupColList = data
        this.groupColTotal = data.length
      })
    },
    fetchColsData() {
      this.listLoading = true
      getColumnList(this.listQuery).then(response => {
        this.columnList = response.list
        this.columnPage.total = response.totalRows
        this.columnPage.currentPage = response.currentPage
        this.columnPage.limit = response.pageRecorders
        this.listLoading = false
      })
    },
    handleColsFilter() { // 字段模板库查询
      this.listQuery.start = 0
      this.fetchColsData()
    },
    handleColsChange(rows) { // 列模板中数据选择事件
      this.colsSelArr.length = 0
      rows.forEach(v => {
        this.colsSelArr.push({ agencyCode: this.agencyCode, columnCode: v.columnCode })
      })
    },
    handleCopyCols() { // 从列模板中添加列数据
      copyTemplateColumn(this.agencyCode, this.currentRow.groupCode, this.colsSelArr).then(() => {
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.fetchGroupColsData(this.currentRow.groupCode)
      })
    },
    createCustomColumn() { // 保存或更新自定义列
      this.$refs['columnForm'].validate((valid) => {
        if (valid) {
          createGroupColumn(this.agencyCode, this.currentRow.groupCode, this.column).then(data => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.resetColumnForm()
            this.fetchGroupColsData(this.currentRow.groupCode)
          })
        }
      })
    },
    handleGroupColDelete(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroupColumn(this.agencyCode, this.currentRow.groupCode, row.columnCode).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.groupColList.indexOf(row)
          this.groupColList.splice(index, 1)
        })
      }).catch(() => {
        return
      })
    },
    handleGroupColUpdate(row) { // 编辑分组列信息
      this.columnStatus = 'update'
      customizeAssign(this.column, row)
    },
    handleColsSizeChange(val) {
      this.columnPage.limit = val
      this.listQuery.length = val
      this.fetchColsData()
    },
    handleColsCurrentChange(val) {
      this.columnPage.currentPage = val
      this.listQuery.start = (val - 1) * this.limit
      this.fetchColsData()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          createGroup(this.agencyCode, this.group).then((data) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['groupTree'].append(data, this.currentNodeCode)
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
          updateGroup(this.agencyCode, this.group).then(() => {
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

