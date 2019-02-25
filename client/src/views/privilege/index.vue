<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色" name="role">
            <el-table :data="roleList"   :height="$store.getters.appHeight - 330" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
              <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                  {{scope.$index}}
                </template>
              </el-table-column>
              <el-table-column label="角色编码" prop="roleCode"></el-table-column>
              <el-table-column label="角色名称" prop="roleName"></el-table-column>
              <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleDistribute(scope.row.roleCode)">分配资源</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination background @size-change="roleSizeChange" @current-change="handleRoleCurrentChange" :current-page="rolePage.currentPage" :page-sizes="[15,30, 50]" :page-size="rolePage.limit" layout="total, sizes, prev, pager, next, jumper" :total="rolePage.total">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户" name="user">
            <el-table :data="userList"   :height="$store.getters.appHeight - 330" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
              <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                  {{scope.$index}}
                </template>
              </el-table-column>
              <el-table-column label="用户编码" prop="employeeCode"></el-table-column>
              <el-table-column label="姓名" prop="userName"></el-table-column>
              <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleDistribute(scope.row.sequenceNBR)">分配资源</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination background @size-change="userSizeChange" @current-change="handleUserCurrentChange" :current-page="userPage.currentPage" :page-sizes="[15,30, 50]" :page-size="userPage.limit" layout="total, sizes, prev, pager, next, jumper" :total="userPage.total">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="16">
      <el-tabs type="border-card" v-model="activeName2" @tab-click="changeTabs">
          <el-tab-pane label="功能权限" name="function" >
            <div :style="{height: ($store.getters.appHeight - 267) + 'px', overflow: 'auto'}">
              <el-tree
                :data="operations"
                show-checkbox
                node-key="moduleCode"
                :render-after-expand="false"
                :default-expand-all="true"
                ref="opertree"
                @check-change="handleCheckChange"
                class="custom-tree"
                :style="{ width: '1760px'}"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.levelNum < 3">{{ data.moduleName }}</span>
                  <template v-else>
                    <span style="margin-right: 10px;" :ref="data.moduleCode">{{ data.moduleName }}</span>
                    [<el-checkbox-group v-model="data.moduleOperation" @change="handleButtonCheckChange($event, data)">
                      <el-checkbox v-for="item in data.operations" :key="item.buttonCode" :label="item.buttonCode">{{item.buttonName}}</el-checkbox>
                    </el-checkbox-group>]
                  </template>
                </span>
              </el-tree>
            </div>
            <el-button type="primary" size="medium" class="save-btn" @click="createData">保存</el-button>
            <!-- <resource-allot :data="operations" :code="currentCode"  :type="activeName"  :hasSelected="hasSelectedOpers"></resource-allot> -->
          </el-tab-pane>
          <el-tab-pane label="数据权限" name="data">
            <div :style="{height: ($store.getters.appHeight - 267) + 'px'}">
              <el-scrollbar v-if="currentCode" :style="{height: ($store.getters.appHeight - 267) + 'px'}">
                <el-select v-model="setting" style="width: 180px;vertical-align: top;margin-top: 20px;" size="medium" placeholder="数据设定" @change="changeData">
                  <el-option v-for="item in dataSettings" :key="item.groupCode" :label="item.groupName" :value="item.groupCode" />
                </el-select>
                <div v-for="(item, index) in queryModel" :key="index" style="margin-top: 10px;">
                  <el-select v-model="item.where" style="width: 180px;vertical-align: top;" size="medium" @change="(value) => changeQuery(value, index, true)">
                    <el-option v-for="column in columnsDefine" :key="column.columnCode" :label="column.columnName" :value="column.columnCode" />
                  </el-select>
                  <el-select v-model="item.symbol" style="width: 180px;vertical-align: top;" size="medium">
                    <el-option v-for="symbol in item.symbols" :key="symbol.key" :label="symbol.label" :value="symbol.key" />
                  </el-select>
                  <el-select v-if="item.where === 'CATEGORY_CODE1'" v-model="item.value" style="width: 180px;vertical-align: top;" size="medium">
                    <el-option v-for="(cate, index) in categoryCode1" :key="index" :label="cate.categoryName" :value="cate.categoryCode" />
                  </el-select>
                  <el-select v-else-if="item.where === 'CATEGORY_CODE2'" v-model="item.value" style="width: 180px;vertical-align: top;" size="medium">
                    <el-option v-for="(cate, index) in categoryCode2" :key="index" :label="cate.categoryName" :value="cate.categoryCode" />
                  </el-select>
                  <el-select v-else-if="item.where === 'CATEGORY_CODE'" v-model="item.value" style="width: 180px;vertical-align: top;" size="medium">
                    <el-option v-for="(cate, index) in categoryCode3" :key="index" :label="cate.categoryName" :value="cate.categoryCode" />
                  </el-select>
                  <el-select v-else-if="item.where === 'PLATFORM'" v-model="item.value" style="width: 180px;vertical-align: top;" size="medium">
                    <el-option label="采购中心" value="ms" />
                    <el-option label="资源中心" value="rc" />
                  </el-select>
                  <el-input size="medium" style="width: 180px;" v-model="item.value" v-else />
                  <!-- <el-cascader
                    v-else
                    placeholder="请选择"
                    :options="categoryOps"
                    :props="{'value':'categoryCode', 'label':'categoryName'}"
                    filterable
                    size="medium"
                    popper-class="category-select"
                    expand-trigger="hover"
                    change-on-select
                    ref="categorySel"
                    style="width: 180px;"
                    @change="changeCategory"
                  /> -->
                  <el-select v-model="item.andOr" style="width: 180px;vertical-align: top;" size="medium" @change="(value) => changeCondition(value, index)">
                    <el-option label="复合条件" value="" />
                    <el-option label="并且" value="and" />
                    <el-option label="或者" value="or" />
                  </el-select>
                </div>
                <div style="padding: 10px 0 20px 543px;">
                  <el-button type="primary" size="medium" @click="createDataPrivilege">测试配置</el-button>
                  <el-button type="danger" size="medium" @click="deleteDataPrivilege">删除权限</el-button>
                </div>
                <el-table :data="list" border fit highlight-current-row v-if="setting === 'product_spu'">
                  <el-table-column label="商品编码" prop="SPU_CODE"></el-table-column>
                  <el-table-column label="商品名称" prop="SPU_NAME"></el-table-column>
                  <el-table-column label="商品图片">
                    <template slot-scope="scope">
                      <div style="text-align: center;"><img v-if="scope.row.THUMBNAIL" :src="GLOBAL.imageServer + scope.row.THUMBNAIL" height="50"></div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table :data="list" border fit highlight-current-row v-if="setting === 'supplier'">
                  <el-table-column label="供应商编码" prop="CODE"></el-table-column>
                  <el-table-column label="供应商名称" prop="NAME"></el-table-column>
                  <el-table-column label="供应商类型">
                    <template slot-scope="scope">
                      <div style="text-align: center;">{{ scope.row.PLATFORM === 'ms' ? '采购中心' : '资源中心' }}</div>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-container" v-if="setting">
                  <el-pagination background @size-change="listSizeChange" @current-change="handleListCurrentChange" :current-page="listPage.currentPage" :page-sizes="[15,30, 50]" :page-size="listPage.limit" layout="total, sizes, prev, pager, next, jumper" :total="listPage.total">
                  </el-pagination>
                </div>
                <div style="text-align: center;margin-top: 30px;">
                  <el-button type="primary" size="medium" @click="saveDataPermission">保存</el-button>
                  <el-button size="medium" @click="cancelSave">取消</el-button>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getList } from '@/api/role'
  import { getList as getUserList } from '@/api/user'
  import { getPermissions, getPermissionsByType, createPermissions, createDataPermission, getDataPermission, previewDataPermission, deleteDataPermission } from '@/api/privilege'
  import { getGroupList, getColumnsDefine } from '@/api/asi'
  import resourceAllot from './resourceAllot'
  export default {
    components: { resourceAllot },
    data() {
      return {
        activeName: 'role',
        listLoading: true,
        roleList: null,
        userList: null,
        roleListQuery: {
          start: 0,
          length: 15
        },
        userListQuery: {
          start: 0,
          length: 15,
          sidx: 'recDate',
          sort: 'desc',
          employeeCode: '',
          userName: ''
        },
        rolePage: {
          currentPage: 1,
          limit: 15,
          total: null
        },
        userPage: {
          currentPage: 1,
          limit: 15,
          total: null
        },
        currentCode: '',
        operations: [],
        defaultProps: {
          children: 'children',
          label: 'moduleName'
        },
        activeName2: 'function',
        dataSettings: [],
        setting: '',
        columnsDefine: [],
        queryModel: [{
          where: '',
          symbol: '',
          value: '',
          andOr: '',
          symbols: ''
        }],
        list: [],
        listPage: {
          currentPage: 1,
          limit: 15,
          total: null
        },
        listQuery: {
          start: 0,
          length: 15
        },
        sqlQuery: {},
        categoryCode1: [],
        categoryCode2: [],
        categoryCode3: []
      }
    },
    created() {
      this.fetchRoleData()
      getPermissions().then(data => {
        this.operations = data
      })
    },
    methods: {
      fetchRoleData() {
        this.listLoading = true
        getList(this.roleListQuery).then(response => {
          this.roleList = response.list
          this.rolePage.total = response.totalRows
          this.rolePage.currentPage = response.currentPage
          this.rolePage.limit = response.pageRecorders
          this.listLoading = false
        })
      },
      fetchUserData() {
        this.listLoading = true
        getUserList(this.userListQuery).then(response => {
          this.userList = response.list
          this.userPage.total = response.totalRows
          this.userPage.currentPage = response.currentPage
          this.userPage.limit = response.pageRecorders
          this.listLoading = false
        })
      },
      handleClick(tab, event) {
        if (tab.name === 'user' && !this.userList) {
          this.fetchUserData()
        }
      },
      handleRoleCurrentChange(val) {
        this.rolePage.currentPage = val
        this.roleListQuery.start = (val - 1) * this.rolePage.limit
        this.fetchRoleData()
      },
      roleSizeChange(val) {
        this.rolePage.limit = val
        this.roleListQuery.length = val
        this.fetchRoleData()
      },
      handleUserCurrentChange(val) {
        this.userPage.currentPage = val
        this.userListQuery.start = (val - 1) * this.userPage.limit
        this.fetchUserData()
      },
      userSizeChange(val) {
        this.userPage.limit = val
        this.userListQuery.length = val
        this.fetchUserData()
      },
      handleDistribute(code) {
        this.currentCode = code
        this.cancelSave()
        getPermissionsByType(this.activeName, code).then(v => {
          const temp = {}
          const checkedNodes = []
          v.forEach(a => {
            if (!temp[a[0]]) {
              temp[a[0]] = []
              checkedNodes.push(a[0])
            }
            temp[a[0]].push(a[1])
          })
          console.log(temp)
          /* this.$refs['opertree'].setCheckedKeys([])
          this.$nextTick(() => {
            this.cascadeFilterOperations([], this.operations, temp)
          })*/
          this.cascadeFilterOperations([], this.operations, temp)
        })
      },
      handleCheckChange(node, checked) {
        if (node.levelNum === 3) {
          if (checked) {
            node.moduleOperation = node.operations.map(v => {
              return v.buttonCode
            })
          } else {
            node.moduleOperation = []
          }
        }
      },
      handleCheck(node, { checkedNodes }) {
        if (checkedNodes.length > 0) {
          node.moduleOperation = node.operations.map(v => {
            return v.buttonCode
          })
        } else {
          node.moduleOperation = []
        }
      },
      handleButtonCheckChange(val, node) {
        const checkNode = this.$refs[node.moduleCode].parentNode.previousElementSibling.firstElementChild
        if (val.length > 0 && val.length < node.operations.length) {
          const _opers = node.moduleOperation
          this.$refs['opertree'].setChecked(node.moduleCode, false)
          this.$nextTick(() => {
            node.moduleOperation = _opers
            checkNode.className = 'el-checkbox__input is-indeterminate'
          })
        } else if ((val.length === node.operations.length) && val.length !== 0) {
          checkNode.className = 'el-checkbox__input is-checked'
          this.$refs['opertree'].setChecked(node.moduleCode, true)
        } else {
          checkNode.className = 'el-checkbox__input'
          this.$refs['opertree'].setChecked(node.moduleCode, false)
        }
      },
      cascadeFilterOperations(arr, data, moduleButtons) { // arr 是保存数据时最终返回的子模块信息, moduleButtons是分配资源时传入的模块与按钮的map数据
        data.forEach(item => {
          if (item.children.length > 0) {
            this.cascadeFilterOperations(arr, item.children, moduleButtons)
          } else if (item.childContentType === 'button') {
            if (moduleButtons) {
              item.moduleOperation = moduleButtons[item.moduleCode] || []
              this.handleButtonCheckChange(item.moduleOperation, item)
            } else if (item.moduleOperation.length > 0) {
              arr.push(item)
            }
          }
        })
      },
      createData() {
        if (!this.currentCode) {
          this.$message.error('请选择需要分配权限的主体信息')
        } else {
          const leafData = []
          const fids = []
          this.cascadeFilterOperations(leafData, this.operations, null)
          leafData.forEach(item => {
            item.moduleOperation.forEach(v => {
              fids.push({ 'buttonCode': v, 'moduleCode': item.moduleCode, 'direction': item.direction })
            })
          })
          createPermissions({ agencyCode: this.$store.getters.agencyCode,
            'primaryType': this.activeName, 'primaryCode': this.currentCode, 'privilege': fids }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      },
      changeTabs(tab) {
        if (tab.name === 'data' && !this.dataSettings.length) {
          getGroupList({ parentCode: 'DatabaseTableDefine', agencyCode: this.$store.getters.agencyCode }).then(res => {
            this.dataSettings = res.filter(item => item.lockStatus === 'N').map(item => ({ groupCode: item.groupCode, groupName: item.groupName }))
          })
        }
      },
      async changeData(val) {
        this.queryModel = [{
          where: '',
          symbol: '',
          value: '',
          andOr: '',
          symbols: ''
        }]
        this.list = []
        this.listPage = {
          currentPage: 1,
          limit: 15,
          total: null
        }
        const columns = await getColumnsDefine(val, this.$store.getters.agencyCode)
        this.columnsDefine = columns.map(item => ({ columnCode: item.columnCode, columnName: item.columnName, symbols: item.defaultValue.split(',').map(key => {
          switch (key) {
            case 'eq' : return { key, label: ' = ' }
            case 'neq': return { key, label: ' != ' }
            case 'gt' : return { key, label: ' > ' }
            case 'gte': return { key, label: ' >= ' }
            case 'lt' : return { key, label: ' < ' }
            case 'lte': return { key, label: ' <= ' }
            case 'like': return { key, label: ' LIKE ' }
          }
        }) }))
        if (!this.currentCode) {
          return
        }
        getDataPermission({
          primaryType: this.activeName,
          primaryCode: this.currentCode,
          resourceType: val
        }).then(res => {
          const { sqlQuery } = res
          if (!sqlQuery) {
            return
          }
          this.queryModel = [{
            where: sqlQuery.where,
            symbol: sqlQuery.symbol,
            value: sqlQuery.value,
            andOr: '',
            symbols: ''
          }]
          for (const item of sqlQuery.and) {
            this.queryModel.push({
              where: item.where,
              symbol: item.symbol,
              value: item.value,
              andOr: 'and',
              symbols: ''
            })
          }
          for (const item of sqlQuery.or) {
            this.queryModel.push({
              where: item.where,
              symbol: item.symbol,
              value: item.value,
              andOr: 'or',
              symbols: ''
            })
          }
          const andOr = this.queryModel.map(item => item.andOr)
          this.queryModel = this.queryModel.map((item, index) => {
            this.changeQuery(item.where, index)
            if (index + 1 === this.queryModel.length) {
              return { ...item, andOr: '' }
            }
            return { ...item, andOr: andOr[index + 1] }
          })
        })
      },
      changeQuery(val, index, boolean) {
        this.queryModel[index].symbols = this.columnsDefine.filter(item => item.columnCode === val)[0].symbols
        if (boolean) {
          this.queryModel[index].symbol = ''
          this.queryModel[index].value = ''
        }
        this.list = []
        switch (val) {
          case 'OWNER_ID':
          case 'CHARGE_USER_ID':
            if (!this.queryModel[index].value) {
              this.queryModel[index].value = this.activeName === 'role' ? 'CURRENT_LOGIN_USER' : this.currentCode
            }
            break
          case 'CATEGORY_CODE1':
          case 'CATEGORY_CODE2':
          case 'CATEGORY_CODE':
            break
        }
      },
      changeCondition(value, index) {
        if (!value) {
          this.queryModel = this.queryModel.slice(0, index + 1)
          return
        }
        this.queryModel[index].andOr = value
        !this.queryModel[index + 1] && this.queryModel.push({
          where: '',
          symbol: '',
          value: '',
          andOr: '',
          symbols: ''
        })
        this.list = []
      },
      createDataPrivilege() {
        if (!this.currentCode) {
          this.$message.error('请选择需要分配权限的主体信息')
          return
        }
        for (const item of this.queryModel) {
          if (!item.symbol || !item.value) {
            this.$message.error('条件不能为空')
            return
          }
        }
        const andOr = this.queryModel.map(item => item.andOr)
        const model = this.queryModel.map((item, index) => {
          if (index === 0) {
            return { ...item, andOr: '' }
          }
          return { ...item, andOr: andOr[index - 1] }
        })
        const first = model.shift()
        this.sqlQuery = {
          where: first.where,
          value: first.value,
          symbol: first.symbol,
          and: [],
          or: []
        }
        for (const item of model) {
          this.sqlQuery[item.andOr].push({
            where: item.where,
            value: item.value,
            symbol: item.symbol
          })
        }
        this.listQuery = {
          start: 0,
          length: 15
        }
        this.getList()
      },
      saveDataPermission() {
        if (!this.currentCode) {
          this.$message.error('请选择需要分配权限的主体信息')
          return
        }
        for (const item of this.queryModel) {
          if (!item.symbol || !item.value) {
            this.$message.error('条件不能为空')
            return
          }
        }
        const andOr = this.queryModel.map(item => item.andOr)
        const model = this.queryModel.map((item, index) => {
          if (index === 0) {
            return { ...item, andOr: '' }
          }
          return { ...item, andOr: andOr[index - 1] }
        })
        const first = model.shift()
        this.sqlQuery = {
          where: first.where,
          value: first.value,
          symbol: first.symbol,
          and: [],
          or: []
        }
        for (const item of model) {
          this.sqlQuery[item.andOr].push({
            where: item.where,
            value: item.value,
            symbol: item.symbol
          })
        }
        createDataPermission({
          agencyCode: this.$store.getters.agencyCode,
          primaryType: this.activeName,
          primaryCode: this.currentCode,
          resourceType: this.setting,
          sqlQuery: this.sqlQuery
        }).then(() => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      deleteDataPrivilege() {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDataPermission({
            primaryType: this.activeName,
            primaryCode: this.currentCode,
            resourceType: this.setting
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
          this.cancelSave()
        }).catch(() => {
          return false
        })
      },
      cancelSave() {
        this.setting = ''
        this.queryModel = [{
          where: '',
          symbol: '',
          value: '',
          andOr: '',
          symbols: ''
        }]
        this.list = []
        this.columnsDefine = []
      },
      getList() {
        previewDataPermission({
          agencyCode: this.$store.getters.agencyCode,
          primaryType: this.activeName,
          primaryCode: this.currentCode,
          resourceType: this.setting,
          sqlQuery: this.sqlQuery
        }, this.listQuery.start, this.listQuery.length).then(res => {
          this.list = res.list
          this.listPage.total = res.totalRows
          this.listPage.currentPage = res.currentPage
          this.listPage.limit = res.pageRecorders
        })
      },
      handleListCurrentChange(val) {
        this.listPage.currentPage = val
        this.listQuery.start = (val - 1) * this.listPage.limit
        this.getList()
      },
      listSizeChange(val) {
        this.listPage.limit = val
        this.listQuery.length = val
        this.getList()
      }
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    padding-right: 8px;
  }
  .custom-tree-node .el-checkbox-group{
    padding: 0 10px;
  }
  .save-btn{
    position: fixed;
    right: 80px;
    bottom: 80px;
    z-index: 99;
  }
  .custom-tree .el-tree-node > .el-tree-node__children{
    overflow: inherit;
  }
</style>
