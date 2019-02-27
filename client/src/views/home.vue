<template>
	<div style="padding: 0 40px 80px 0;font-size: 14px;background-color: #f4f4f4;">
		<div style="position: relative;line-height: 20px; background-color: #ffffff; border-radius: 3px;font-size: 12px;padding: 12px 16px;">
			<span>今天是 {{getDate()}}</span>
			<span v-if="getNearlyUsed().length" style="margin: 0 10px 0 30px;">最近使用:</span>
			<span @click="linkTo(item)" style="padding-right: 20px;cursor:pointer;color: rgb(64, 158, 255);" v-for="item in getNearlyUsed()" :key="item.name">{{ item.title }}</span>
		</div>
	</div>
</template>
<script>
import Cookies from 'js-cookie'
import { parseTime } from '@/utils'
export default {
	components: {
  },
  data() {
    return {
      modules: [],
			dialogVisible: false,
			checkRows: [],
			checked: [],
			list: {}
    }
	},
	created() {
	},
  methods: {
		getDate() {
			return parseTime(Date.now(), '{y}-{m}-{d} 星期{a}')
		},
		formatTime(createTime) {
        return parseTime(parseInt(createTime), '{y}-{m}-{d}')
      },
    getNearlyUsed() {
			const used = Cookies.get('nearlyUsed')
      return used ? JSON.parse(used) : []
    },
    linkTo(item) {
			const { href } = this.$router.resolve({ name: item.name, query: item.query })
			window.open(href, 'newWindow')
		},
		linkToInner(item) {
			let { name, query } = item
			console.log(name)
			switch (name) {
				case 'rcMyOfferList':
					name = 'rcMyOfferProducts'
					sessionStorage.setItem('offerFormId', query.id)
					break
				case 'myOfferList':
					name = 'myOfferProducts'
					sessionStorage.setItem('offerFormId', query.id)
					break
				case 'myProduceOrder':
					name = 'myProductDetail'
					query = {
						orderStatus: 'finish',
						orderId: query.id
					}
					break
				case 'myPurchaseOrder':
					name = 'myRcProductOrderDetail'
					query = {
						orderStatus: 'finish',
						orderId: query.id
					}
					break
			}
			this.$router.push({
        name,
        query
      })
		},
    modulesSetting() {
			this.dialogVisible = true
		},
		toggleRows() {
			this.$nextTick(() => {
				this.modules.filter(item => this.checked.map(checked => checked.name).includes(item.name)).forEach(item => {
					this.$refs.multipleTable.toggleRowSelection(item, true)
				})
			})
		},
		toUp(row) {
			const index = this.modules.indexOf(row)
			const temp = this.modules[index]
			this.$set(this.modules, index, this.modules[index - 1])
      this.$set(this.modules, index - 1, temp)
		},
		toDown(row) {
			const index = this.modules.indexOf(row)
			const temp = this.modules[index]
			this.$set(this.modules, index, this.modules[index + 1])
      this.$set(this.modules, index + 1, temp)
		},
		handleSelectionChange(val) {
			this.checkRows = val
		},
		readData() {
			this.checked.forEach(item => {
				const { name } = item
				if (this.list[name]) return false
				this[name](name)
      })
		}
  }
}
</script>

<style rel="stylesheet/css" scoped>
	.el-card__header{
		background-color: #edf6ff;
    border: none;
    font-size: 16px;
    padding: 0 20px 0 0;
    height: 56px;
	}
	.card-title{
		background: url("../imgs/card-bg.png") no-repeat center;
		height: 47px;
		line-height: 48px;
    width: 210px;
    float: left;
    margin-top: 9px;
		padding-left: 18px;
		position: relative;
		color: #4c73b3;
	}
	.card-title i{
		position: absolute;
		display: block;
		width: 4px;
		height: 17px;
		left: 0;
		top: 15px;
		background-color: #276fb7;
	}
	.myTable.el-table td, .myTable.el-table th.is-leaf{
		border: none;
	}
	.myTable.el-table::before{
		height: 0;
	}
	.home-settings{
		width: 36px;
		height: 36px;
		background-color: #434343;
		border-radius: 5px 0px 0px 5px;
		opacity: 0.62;
		cursor: pointer;
		top: 93px;
		right: -50px;
		line-height: 50px;
		text-align: center;
		position: absolute;
		transition: all 0.2s linear;
	}
	.home-settings:hover{
		opacity: 0.9;
	}
</style>
