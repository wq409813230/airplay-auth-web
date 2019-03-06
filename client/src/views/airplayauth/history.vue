<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"  placeholder="机型" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.machineModel"></el-input>
      <el-input @keyup.enter.native="handleFilter"  placeholder="公司" size="medium" style="width: 200px;" class="filter-item"  v-model="listQuery.companyName"></el-input>
      <el-button v-if="operButtons.indexOf('queryAuthHistory') > -1" class="filter-item" type="primary"  size="medium" @click="handleFilter">搜索</el-button>
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
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证状态" align="center">
        <template slot-scope="scope">
          {{scope.row.authSuccess}}
        </template>
      </el-table-column>
      <el-table-column label="认证时间" align="center">
        <template slot-scope="scope">
          {{scope.row.authTime | parseTime('{y}-{m}-{d} {h}:{mm}:{ss}')}}
        </template>
      </el-table-column>
      <el-table-column label="认证失败原因" align="center">
        <template slot-scope="scope">
          {{scope.row.failedMessage}}
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
  import { getAuthHistoryByPage } from '@/api/authconfig'
  export default {
    name: 'authHistoryTemplate',
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
        total: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getAuthHistoryByPage(this.listQuery).then(response => {
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
      }
    }
  }
</script>
