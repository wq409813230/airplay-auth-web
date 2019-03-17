<template>
  <div class="app-container dictionary">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"  placeholder="字典编码" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.dictCode"></el-input>
      <el-input @keyup.enter.native="handleFilter"  placeholder="字典名称" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.dictName"></el-input>
      <el-button class="filter-item" type="primary"  size="medium" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" :disabled="dictAddDisable" style="margin-left: 10px;"  size="medium"  @click="handleCreate" type="warning">新增</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" :height="$store.getters.appHeight - 320" element-loading-text="Loading" border fit highlight-current-row ref="dictable"  @row-click="handleRowClick">
      <el-table-column align="center" label='ID' width="95"   class="sub-table">
        <template slot-scope="scope">
            {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="字典编码" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.sequenceNBR">
            {{scope.row.dictCode}}
          </template>
          <span v-else><el-input class="edit-input" size="small" v-model="scope.row.dictCode"></el-input>
          <span class="warning-info">{{ dictRules.dictCode.message }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="字典名称">
        <template slot-scope="scope">
          <template v-if="scope.row.sequenceNBR && !scope.row.edit">
            {{scope.row.dictName}}
          </template>
          <span v-else>
            <el-input class="edit-input" size="small" v-model="scope.row.dictName"></el-input>
            <span class="warning-info">{{ dictRules.dictName.message }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <template v-if="scope.row.sequenceNBR && !scope.row.edit">
            {{scope.row.description}}
          </template>
          <span v-else><el-input type="textarea" class="edit-input" size="small" v-model="scope.row.description"></el-input>
          <span class="warning-info">{{ dictRules.description.message }}</span></span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="锁定状态" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.lockStatus == 'N' ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.sequenceNBR && !scope.row.edit" type="primary" plain size="mini"  @click='handleUpdate(scope.row)'>编辑</el-button>
          <el-button v-else type="primary" plain size="mini" @click="createData(scope.row, scope.row.edit)">保存</el-button>
          <el-button v-if="!scope.row.sequenceNBR || scope.row.edit " type="warning" plain size="mini"  @click='handleCancel(scope.row)'>取消</el-button>
          <el-button v-else type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15,30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <div class="right-panel" v-show="rightPanelShow">
      <el-button  type="primary" size="small" :disabled="dictAddValDisable" style="margin-bottom: 6px;float: right;" @click="handleDictValCreate">新增</el-button>
      <el-button  type="warning" size="small" style="margin-bottom: 6px;margin-right: 5px;float: right;" @click="handleDictValClosed">关闭</el-button>
      <el-table :data="dicValList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="字典KEY" width="180">
          <template slot-scope="dicval">
            <template v-if="dicval.row.sequenceNBR">{{ dicval.row.entryKey }}</template>
            <span v-else><el-input class="edit-input" size="small" v-model="dicval.row.entryKey"></el-input>
            <span class="warning-info">{{ dictValRules.entryKey.message }}</span></span>
          </template>
        </el-table-column>

        <el-table-column  label="字典VALUE">
          <template slot-scope="dicval">
            <template v-if="dicval.row.sequenceNBR && !dicval.row.edit">{{ dicval.row.entryValue }}</template>
            <span v-else>
              <el-input class="edit-input" size="small" v-model="dicval.row.entryValue"></el-input>
              <span class="warning-info">{{ dictValRules.entryValue.message }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column  label="字典值描述">
          <template slot-scope="dicval">
            <template v-if="dicval.row.sequenceNBR && !dicval.row.edit">{{ dicval.row.description }}</template>
            <span v-else><el-input  type="textarea" class="edit-input" size="small" v-model="dicval.row.description"></el-input>
            <span class="warning-info">{{ dictValRules.description.message }}</span></span>
          </template>
        </el-table-column>
        <el-table-column  label="锁定状态" width="100" align="center">
          <template slot-scope="dicval">
            {{dicval.row.lockStatus == 'N' ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="dicval">
            <el-button v-if="dicval.row.sequenceNBR && !dicval.row.edit" type="text"
            @click='handleDictValUpdate(dicval.row)' size="small">编辑</el-button>
            <el-button v-if="!dicval.row.sequenceNBR || dicval.row.edit" type="text" @click="createDicValData(dicval.row)" size="small">保存</el-button>
            <el-button type="text" v-if="dicval.row.sequenceNBR && !dicval.row.edit" size="mini" @click="handleDicValLockStatus(dicval.row)">
          {{dicval.row.lockStatus == 'N' ? '禁用' : '启用'}}</el-button>
            <el-button v-if="!dicval.row.sequenceNBR || dicval.row.edit" type="text"
            @click="handleDicValCancel(dicval.row)" size="small">取消</el-button>
            <el-button v-else type="text"  size="mini" @click="handleDicValDelete(dicval.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page="listDicValPage.currentPage" :page-sizes="[10,20,30]" :page-size="listDicValPage.limit"  @current-change="handleDicValCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="listDicValPage.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getList, getDicValList, updateDicVal, createDicVal, createDict, updateDict, deleteDict, deleteDictVal, changeDictValStatus,
  validateDictCodeAvaiable, validateEntryKeyAvaiable } from '@/api/dictionary'
import { validateCode } from '@/utils/validate'
export default {
  data() {
    const validateDictCode = (code, cb) => {
      this.dictRules.dictCode.message = ''
      if (!code) {
        this.dictRules.dictCode.message = '字典编号不能为空'
        cb(false)
      } else if (!validateCode(code)) {
        this.dictRules.dictCode.message = '字典编号只接受字母,数字,下划线'
        cb(false)
      } else {
        validateDictCodeAvaiable(code).then((data) => {
          if (!data) {
            this.dictRules.dictCode.message = '字典编号已经存在'
            cb(false)
          } else {
            cb(true)
          }
        })
      }
    }
    const validateDictName = (name) => {
      this.dictRules.dictName.message = ''
      if (!name) {
        this.dictRules.dictName.message = '字典名称不能为空'
        return false
      } else if (name.length > 50) {
        this.dictRules.dictName.message = '字典名称不能超过50个字符'
        return false
      }
      return true
    }

    const validateDictDesc = (desc) => {
      this.dictRules.description.message = ''
      if (desc.length > 126) {
        this.dictRules.description.message = '字典值描述不能超过126个字符'
        return false
      }
      return true
    }

    const validateEntryKey = (code, key, agency, cb) => {
      this.dictValRules.entryKey.message = ''
      if (!key) {
        this.dictValRules.entryKey.message = '字典KEY不能为空'
        cb(false)
      } else if (!validateCode(key)) {
        this.dictValRules.entryKey.message = '字典KEY只接受字母,数字,下划线'
        cb(false)
      } else {
        validateEntryKeyAvaiable(code, key, agency).then((data) => {
          if (!data) {
            this.dictValRules.entryKey.message = '字典KEY已经存在'
            cb(false)
          } else {
            cb(true)
          }
        })
      }
    }
    const validateEntryValue = (value) => {
      this.dictValRules.entryValue.message = ''
      if (!value) {
        this.dictValRules.entryValue.message = '字典VALUE不能为空'
        return false
      } else if (value.length > 2000) {
        this.dictValRules.entryValue.message = '字典VALUE不能超过2000个字符'
        return false
      }
      return true
    }

    const validateDictValDesc = (desc) => {
      this.dictValRules.description.message = ''
      if (desc.length > 200) {
        this.dictValRules.description.message = '字典值描述不能超过200个字符'
        return false
      }
      return true
    }
    return {
      list: null, // 字典列表
      dicValList: null, // 字典值列表
      listLoading: true,
      listQuery: {
        start: 0,
        length: 15,
        dictCode: '',
        dictName: '',
        sort: 'desc',
        sidx: 'recDate'
      },
      listDicValQuery: { // 字典值查询信息
        start: 0,
        length: 10,
        agencyCode: this.$store.getters.agencyCode
      },
      dictAddDisable: false, // 新增按钮是否禁用标识,字典每次只能新增一条
      dictAddValDisable: false,
      dictRules: {
        dictCode: { validate: validateDictCode, message: '' },
        dictName: { validate: validateDictName, message: '' },
        description: { validate: validateDictDesc, message: '' }
      },
      dictValRules: {
        entryKey: { validate: validateEntryKey, message: '' },
        entryValue: { validate: validateEntryValue, message: '' },
        description: { validate: validateDictValDesc, message: '' }
      },
      listDicValPage: { // 字典值分页信息
        currentPage: 1,
        limit: 10,
        total: null
      },
      currentPage: 1,
      limit: 15,
      total: null,
      currentRow: null, // 当前选中行
      rightPanelShow: false // 是否显示右侧字典值列表信息
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() { // 查询字典列表
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.list.map(v => {
          this.$set(v, 'edit', false)
          v.originalDictName = v.dictName
          v.originalDesc = v.description
          return v
        })
        this.total = response.totalRows
        this.currentPage = response.currentPage
        this.limit = response.pageRecorders
        this.listLoading = false
      })
    },
    handleFilter() { // 搜索字典信息
      this.listQuery.start = 0
      this.fetchData()
    },
    resetDictValidator() {
      this.dictRules['dictCode'].message = ''
      this.dictRules['dictName'].message = ''
      this.dictRules['description'].message = ''
    },
    resetDictValValidator() {
      this.dictValRules['entryKey'].message = ''
      this.dictValRules['entryValue'].message = ''
      this.dictValRules['description'].message = ''
    },
    handleCreate() { // 新增字典
      var addRow = {
        dictCode: '',
        dictName: '',
        lockStatus: 'Y',
        description: ''
      }
      this.resetDictValidator()
      this.dictAddDisable = true
      this.list.splice(0, 0, addRow)
    },
    handleUpdate(row) {
      this.resetDictValidator()
      this.dictAddDisable = true
      row.edit = !row.edit
    },
    handleCancel(row) { // 字典新增或编辑取消
      const index = this.list.indexOf(row)
      if (row.sequenceNBR) {
        row.dictName = row.originalDictName
        row.description = row.originalDesc
        row.edit = false
      } else {
        this.list.splice(index, 1)
      }
      this.dictAddDisable = false
    },
    createData(row, flag) { // 保存或更新字典信息
      var nameFlag = this.dictRules['dictName'].validate(row.dictName)
      var descFlag = this.dictRules['description'].validate(row.description)
      if (flag) {
        if (nameFlag && descFlag) {
          updateDict(row.dictCode, row).then((data) => {
            this.$set(row, 'edit', false)
            data.originalDictName = data.dictName
            data.originalDesc = data.description
            this.dictAddDisable = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      } else {
        var $this = this
        this.dictRules['dictCode'].validate(row.dictCode, function(flag) {
          if (flag && nameFlag && descFlag) {
            createDict(row).then((data) => {
              $this.$set(data, 'edit', false)
              data.originalDictName = data.dictName
              data.originalDesc = data.description
              $this.list.splice(0, 1, data)
              $this.dictAddDisable = false
              $this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    },
    handleDelete(row) { // 字典删除
      const index = this.list.indexOf(row)
      if (row.sequenceNBR) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDict([row.dictCode]).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        }).catch(() => {
          return
        })
      }
    },
    handleRowClick: function(row, event, column) { // 字典行点击事件 点击事件只作用在ID列上
      if (column.label !== 'ID' || !row.sequenceNBR || row.edit) { return false }
      this.dictAddValDisable = false
      if (!this.currentRow || this.currentRow.dictCode !== row.dictCode) {
        this.currentRow = row
        this.fetchDicValData(row)
        this.rightPanelShow = true
      } else {
        this.currentRow = null
        this.rightPanelShow = false
        this.$refs.dictable.setCurrentRow()
      }
    },
    fetchDicValData(row) { // 获取字典值列表信息
      getDicValList(row.dictCode, this.listDicValQuery).then((data) => {
        this.dicValList = data.list.map(v => {
          this.$set(v, 'edit', false)
          v.originalEntryValue = v.entryValue
          v.originalDesc = v.description
          return v
        })
        this.listDicValPage.total = data.totalRows
        this.listDicValPage.currentPage = data.currentPage
        this.listDicValPage.limit = data.pageRecorders
        this.listLoading = false
      })
    },
    handleDictValCreate() { // 字典值新增
      this.resetDictValValidator()
      const code = this.currentRow.dictCode
      var addRow = {
        entryKey: '',
        entryValue: '',
        lockStatus: 'Y',
        description: '',
        dictCode: code,
        agencyCode: this.$store.getters.agencyCode
      }
      this.dicValList.splice(0, 0, addRow)
      this.dictAddValDisable = true
    },
    handleDictValUpdate(row) {
      this.resetDictValValidator()
      this.dictAddValDisable = true
      row.edit = !row.edit
    },
    createDicValData(row) { // 新增或编辑字典值信息
      var valueFlag = this.dictValRules['entryValue'].validate(row.entryValue)
      var descFlag = this.dictValRules['description'].validate(row.description)
      if (row.edit) { // 编辑保存
        if (valueFlag && descFlag) {
          row.edit = false
          row.originalEntryValue = row.entryValue
          row.originalDesc = row.description
          updateDicVal(row.dictCode, row.entryKey, row).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.dictAddValDisable = false
          })
        }
      } else { // 新增保存
        var $this = this
        const code = this.currentRow.dictCode
        this.dictValRules['entryKey'].validate(code, row.entryKey, this.$store.getters.agencyCode, function(flag) {
          if (flag && valueFlag && descFlag) {
            createDicVal(code, row).then((data) => {
              $this.$set(data, 'edit', false)
              data.originalEntryValue = data.entryValue
              data.originalDesc = data.description
              $this.dicValList.splice(0, 1, data)
              $this.dictAddValDisable = false
              $this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    },
    handleDicValCancel(row) { // 字典值取消编辑或新增
      if (row.edit) {
        row.entryValue = row.originalEntryValue
        row.description = row.originalDesc
        row.edit = false
      } else {
        const index = this.dicValList.indexOf(row)
        this.dicValList.splice(index, 1)
      }
      this.dictAddValDisable = false
    },
    handleDicValLockStatus(row) { // 字典值启用禁用
      const index = this.dicValList.indexOf(row)
      changeDictValStatus(row.dictCode, row.entryKey).then((data) => {
        data.edit = false
        data.originalEntryValue = data.entryValue
        data.originalDesc = data.description
        this.dicValList.splice(index, 1, data)
        this.$notify({
          title: '成功',
          message: '修改',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDicValDelete(row) { // 字典值删除事件
      const index = this.dicValList.indexOf(row)
      if (row.sequenceNBR) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDictVal(row.dictCode, [row.entryKey]).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.dicValList.splice(index, 1)
          })
        }).catch(() => {
          return
        })
      }
    },
    handleDictValClosed() { // 字典值列表窗口关闭
      this.currentRow = null
      this.rightPanelShow = false
      this.dictAddValDisable = false
      this.$refs.dictable.setCurrentRow()
    },
    handleSizeChange(val) { // 更改字典每页显示条数
      this.limit = val
      this.listQuery.length = val
      this.fetchData()
    },
    handleCurrentChange(val) { // 字典翻页事件
      this.currentPage = val
      this.listQuery.start = (val - 1) * this.limit
      this.fetchData()
    },
    handleDicValCurrentChange(val) { // 字典值翻页事件
      this.listDicValPage.currentPage = val
      this.listDicValQuery.start = (val - 1) * this.listDicValPage.limit
      this.fetchDicValData(this.currentRow)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .right-panel{
    padding:10px 3px;
    position: fixed;
    overflow-y: scroll;
    top:140px;
    right:0;
    bottom:0;
    width: 850px;
    z-index: 10;
    background-color: #fff;
    box-shadow: 1px 0px 3px 3px #f1f1f1
  }
  .warning-info{
    color: #f56c6c;
    font-size: 12px;
  }
  .dictionary {
    .el-table .cell{
      vertical-align: top;
    }
    /* .el-table__row td:not(:last-child){
      vertical-align: top;
    } */
  }
</style>


