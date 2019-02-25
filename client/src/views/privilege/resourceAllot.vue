<template>
  <div>
	  <el-table
	    :data="data"
      row-key="moduleCode"
	    @expand-change="handleExpandChange"
      :expand-row-keys="expandRows"
	    :max-height="$store.getters.appHeight - 200"
	    style="width: 100%;overflow-y: auto;">
	    <el-table-column type="expand">
	      <template slot-scope="res">
	        <el-table :data="res.row.operations" border row-key="buttonCode" 
          :ref="res.row.moduleCode + 'sub'"
	        	@selection-change="handleSelectionChange(res.row.moduleCode, res.row.direction, $event)"
            >
	        	<el-table-column type="selection" width="55" reserve-selection  v-if="code"></el-table-column>
          <el-table-column label="按钮编码" prop="buttonCode"></el-table-column>
			    <el-table-column label="按钮名称" prop="buttonName"></el-table-column>
			 </el-table>
	      </template>
	    </el-table-column>
	    <el-table-column label="资源模块">
        <template slot-scope="scop">
          {{ scop.row.moduleName }}
        </template> 
      </el-table-column>
	  </el-table>
	  <div style="text-align: right;margin-top: 20px;">
	    <el-button type="primary" size="medium" @click="createData">保存</el-button>
	  </div>
  </div>
</template>

<script>
  import { createPermissions } from '@/api/privilege'
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
      type: { // 资源类型 module:模块分配权限 user:用户权限分配 role:角色权限分配
        type: String,
        required: true
      },
      hasSelected: { // 已选的操作集合
        type: Object,
        required: true
      },
      expandAll: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selected: {}, // 所有选中的数据集 key:resourceCode value:operations
        expandRows: [] // 初始展开的行集合 用于再次编辑时初始化数据，只有行展开才能进行选中操作
      }
    },
    created() {
      this.selected = this.hasSelected
      for (const k in this.selected) {
        this.expandRows.push(k)
        this.$nextTick(() => {
          this.selected[k].forEach(s => {
            const tableData = this.$refs[k + 'sub'].data
            this.$refs[k + 'sub'].toggleRowSelection(tableData.find(d => d.buttonCode === s.buttonCode), true)
          })
        })
      }
    },
    watch: {
      hasSelected: {
        handler(newv, oldv) {
          this.expandRows = []
          this.selected = {}
          Object.keys(newv).map((key) => {
            this.expandRows.push(key)
            this.selected[key] = newv[key]
            this.$nextTick(() => {
              newv[key].forEach(s => {
                const tableData = this.$refs[key + 'sub'].data
                const row = tableData.find(d => d.buttonCode === s.buttonCode)
                if (row) {
                  this.$refs[key + 'sub'].toggleRowSelection(row, true)
                }
              })
            })
          })
        }
      }
    },
    methods: {
      handleExpandChange(row) { // 展开行后重新选中已选的值 （行关闭后子表格会消失所以当重新展开行信息时，需手动对数据进行重置操作，否则无法记忆之前的操作信息）
        this.$nextTick(() => {
          if (this.$refs[row.moduleCode + 'sub'] && this.selected[row.moduleCode]) { // 展开
            this.selected[row.moduleCode].forEach(s => {
              this.$refs[row.moduleCode + 'sub'].toggleRowSelection(s, true)
            })
          }
        })
      },
      handleSelectionChange(code, dir, val) {
        if (dir) {
          this.selected[code] = val.map(v => {
            if (v) {
              v['direction'] = dir
              return v
            }
          })
        } else {
          this.selected[code] = val
        }
      },
      createData() {
        const fids = []
        if (this.selected) {
          for (const k in this.selected) {
            this.selected[k].forEach(v => {
              fids.push({ 'buttonCode': v.buttonCode, 'moduleCode': k, 'direction': v.direction })
            })
          }
          createPermissions({ agencyCode: this.$store.getters.agencyCode,
            'primaryType': this.type, 'primaryCode': this.code, 'privilege': fids }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      }
    }
  }
</script>