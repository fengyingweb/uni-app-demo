<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f2f2f2;
		overflow-x: hidden;
	}
	.wrapper {
		width: 750rpx;
		overflow-x: hidden;
	}

	/* #endif */
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.justify-between {
		justify-content: space-between;
	}
	.justify-around {
		justify-content: space-around;
	}
	.justify-center {
		justify-content: center;
	}
	.align-center {
		align-items: center;
	}
	.center {
		justify-content: center;
		align-items: center;
	}
</style>
