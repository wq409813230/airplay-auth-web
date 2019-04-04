<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"  placeholder="设备MAC地址" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.deviceMac"></el-input>
      <el-button class="filter-item" type="primary"  size="medium" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" :height="$store.getters.appHeight - 320" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="设备MAC地址">
        <template slot-scope="scope">
          {{scope.row.deviceMac}}
        </template>
      </el-table-column>
      <el-table-column label="设备机型" width="110">
        <template slot-scope="scope">
          {{scope.row.machineModel}}
        </template>
      </el-table-column>
      <el-table-column label="设备所属公司" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.companyCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权码" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.authCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证时间" align="center">
        <template slot-scope="scope">
          {{scope.row.recDate | parseTime('{y}-{m}-{d} {h}:{mm}:{ss}')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
  import { getAuthInfoList, deleteAuthInfo } from '@/api/authconfig'
  export default {
    name: 'authInfoTemplate',
    data() {
      return {
        authConfigId: null,
        list: null,
        operButtons: this.$store.getters.operButtons,
        listLoading: true,
        listQuery: {
          start: 0,
          length: 15,
          deviceMac: '',
          machineModel: '',
          companyName: ''
        },
        currentPage: 1,
        limit: 15,
        total: null
      }
    },
    created() {
      this.authConfigId = this.$route.query.authConfigId
      this.fetchData(this.authConfigId)
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getAuthInfoList(this.authConfigId, this.listQuery).then(response => {
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
      handleDelete(row) {
        var self = this
        self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAuthInfo(row.sequenceNBR).then(() => {
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
    }
  }
</script>
