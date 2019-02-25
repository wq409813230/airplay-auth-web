<template>
  <div>
	  <el-table
	    :data="data"
      row-key="resourceCode"
      :expand-row-keys="expandRows"
	    :max-height="500"
      @expand-change="handleExpandChange"
	    style="width: 100%;overflow-y: auto;">
	    <el-table-column type="expand">
	      <template slot-scope="res">
	        <el-table :data="res.row.operations" border row-key="funcId" 
          :ref="res.row.resourceCode + 'sub'" 
          highlight-current-row
            @current-change="handleCurrentChange">
  			    <el-table-column label="资源描述" prop="oprateDescription"></el-table-column>
  			    <el-table-column label="FID" prop="funcId"></el-table-column>
			 </el-table>
	      </template>
	    </el-table-column>
	    <el-table-column label="资源模块">
        <template slot-scope="scop">
          {{ scop.row.resourceName }}
        </template> 
      </el-table-column>
	  </el-table>
  </div>
</template>

<script>
  export default {
    name: 'resourceAllot',
    props: {
      data: {
        type: [Array, Object],
        required: true
      },
      code: { // 模塊code或用户角色code
        type: String,
        required: true
      },
      hasSelectedFuncId: { // 已选的FuncId
        type: String,
        required: true
      },
      hasSelectedResId: { // 已选FuncId的父resourceCode
        type: String,
        required: true
      },
      expandAll: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentResourceCode: null, // 当前选中行父code
        selected: null, // 选中的fid
        expandRows: [] // 初始展开的行集合 用于再次编辑时初始化数据，只有行展开才能进行选中操作
      }
    },
    created() {
      this.currentResourceCode = this.hasSelectedResId
      if (this.currentResourceCode) {
        this.expandRows.push(this.currentResourceCode)
        this.$nextTick(() => {
          const tableData = this.$refs[this.currentResourceCode + 'sub'].data
          this.$refs[this.currentResourceCode + 'sub'].setCurrentRow(tableData.find(d => d.funcId === this.hasSelectedFuncId))
        })
      }
    },
    watch: {
      hasSelectedFuncId: {
        handler(newv, oldv) {
          this.expandRows = []
          this.currentResourceCode = this.hasSelectedResId
          if (this.currentResourceCode) {
            this.expandRows.push(this.currentResourceCode)
            this.$nextTick(() => {
              const tableData = this.$refs[this.currentResourceCode + 'sub'].data
              this.$refs[this.currentResourceCode + 'sub'].setCurrentRow(tableData.find(d => d.funcId === newv))
            })
          }
        }
      }
    },
    methods: {
      handleExpandChange(row, expandedRows) {
        const expandedResource = []
        expandedRows.forEach(r => {
          expandedResource.push(r.resourceCode)
        })
        if (expandedResource.indexOf(this.currentResourceCode) === -1) { // 如果已选行所在父表格关闭则取消所选项
          this.$emit('selectChange', null)
        }
      },
      handleCurrentChange(val) {
        if (val) {
          this.currentResourceCode = val.resourceCode
          this.$emit('selectChange', val)
        }
      }
    }
  }
</script>