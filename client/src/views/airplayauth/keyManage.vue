<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="operButtons.indexOf('generateKeyPair') > -1" class="filter-item" type="primary"  size="medium" @click="generateKeyPair">生成密钥对</el-button>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="公钥">
        <el-main>
          <div style='width: 100%;display:block;word-break: break-all;word-wrap: break-word;'>
            {{keyPair.publicKey}}
          </div>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="私钥">
        <el-main>
          <div style='width: 100%;display:block;word-break: break-all;word-wrap: break-word;'>
            {{keyPair.privateKey}}
          </div>
        </el-main>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import { generateKeyPair, getKeyPair } from '@/api/authconfig'
  export default {
    name: 'keyManageTemplate',
    data() {
      return {
        operButtons: this.$store.getters.operButtons,
        keyPair: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getKeyPair().then(response => {
          this.keyPair = response
        })
      },
      generateKeyPair() {
        var self = this
        self.$confirm('是否重新生成RSA密钥对?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          generateKeyPair().then(() => {
            self.$notify({
              title: '成功',
              message: '创建成功',
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
