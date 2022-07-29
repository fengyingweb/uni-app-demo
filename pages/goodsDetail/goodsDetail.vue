<template>
	<view class="wrapper">
		<view class="detail-banner">
			<image class="banner-img" :src="goodsDetail.IMAGE1" :lazy-load="true" mode="aspectFit"></image>
		</view>
		<view class="goods-info">
		    <text class="goods-title">{{goodsDetail.NAME}}</text>
		    <text v-if="goodsDetail.PRESENT_PRICE" class="goods-prize">￥{{goodsDetail.PRESENT_PRICE|moneyFilter}}</text>
		</view>
		<view class="flex-row align-center tab-wrapper">
			<view
			    v-for="(item, ind) in tabList"
				:key="item.title"
				:class="['tab-item', (activeTab === ind) && 'tab-item-active']"
				@click="clickTab(ind)">
				<text class="tab-title">{{item.title}}</text>
			</view>
			<view class="tab-line" :style="tabLineStyle"></view>
		</view>
		<view class="detail-img-wrapper" v-if="activeTab === 0" v-html="goodsDetail.DETAIL"></view>
		<view class="rate-wrapper" v-else>
			<uni-rate v-model="rateVal" activeColor="#07c160" />
		</view>
		<view class="goods-carts">
			<uni-goods-nav
			    :options="options"
				:fill="true"
				:button-group="buttonGroup"
				@click="onClickLeft"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
import { queryDetailGoodsInfo } from '@/http/api'
export default {
	data() {
		return {
			goodsDetail: {}, // 详情数据
			goodsId: '',
			detailImgs: [],
			activeTab: 0,
			tabList: [
				{title: '商品详情'},
				{title: '评论'}
			],
			tabItemWidth: 0,
			tabLineWidth: 0,
			rateVal: 3,
			options: [
				{
					icon: 'chat',
				    text: '客服'
				},
				{
					icon: 'shop',
					text: '店铺',
					info: 2,
					infoBackgroundColor: '#007aff',
					infoColor: "#f5f5f5"
				},
				{
					icon: 'cart',
					text: '购物车',
				    info: 2,
				},
			],
			buttonGroup: [
				{
					text: '加入购物车',
					backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
					color: '#fff'
				},
				{
					text: '立即购买',
					backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
					color: '#fff'
				}
			],
		}
	},
	filters: {
		moneyFilter(money) {
			return money.toFixed(2);
		}
	},
	computed: {
		transX() {
			return (this.tabItemWidth - this.tabLineWidth) / 2;
		},
		tabLineStyle() {
			// #ifndef MP-WEIXIN
			return {
				transform: `translateX(${this.activeTab * this.tabItemWidth + this.transX}px)`
			}
			// #endif
			
			// #ifdef MP-WEIXIN
			let style = `transform: translateX(${this.activeTab * this.tabItemWidth + this.transX}px)`
			return style
			// #endif
		},
	},
	onLoad(query) {
		console.log(query);
		this.goodsId = query.goodsId;
		this.initData();
	},
	onUnload() {
		clearTimeout(this.timer);
	},
	mounted() {
		this.$nextTick(()=> {
			this.getDomAttr();
		})
	},
	methods: {
		// 获取元素属性
		getDomAttr() {
			const queryDom = uni.createSelectorQuery().in(this);
			const tabItemEle = queryDom.select('.tab-item-active');
			const tabLineEle = queryDom.select('.tab-line');
			tabItemEle.boundingClientRect(tabItemData=> {
				this.tabItemWidth = tabItemData.width;
			}).exec();
			tabLineEle.boundingClientRect(lineData=> {
				this.tabLineWidth = lineData.width;
			}).exec();
		},
		// 初始化数据
		async initData() {
			uni.showLoading({
				title: '加载中'
			});
			const params = {
				goodsId: this.goodsId
			};
			const detailRes = await queryDetailGoodsInfo(params);
			this.timer = setTimeout(()=> {
				uni.hideLoading();
			}, 1000);
			if (detailRes.code === 0) {
			    this.goodsDetail = detailRes.data;
			}
		},
		// 点击tab
		clickTab(ind) {
			this.activeTab = ind;
		},
		onClickLeft(e) {
			uni.showToast({
				title: `点击${e.content.text}`,
				icon: 'none'
			})
		},
		buttonClick(e) {
			console.log(e)
			this.options[2].info++
		}
	}
}
</script>

<style lang="scss">
    .detail-banner {
        margin-bottom: 20px;
        width: 100%;
    }
    .banner-img {
        display: block;
        width: 100%;
		height: 750rpx;
    }
	.goods-info {
	    border-bottom: 1px solid #eee;
	    padding: 20rpx 32rpx;
	    width: 100%;
	    background: #fff;
	    font-size: 28rpx;
	    color: #333;
		box-sizing: border-box;
	}
	.goods-title {
		display: block;
	    line-height: 48rpx;
	    font-size: 32rpx;
	}
	.goods-prize {
		display: block;
	    color: #f56;
	}
	.tab-wrapper {
		position: relative;
		width: 100%;
		height: 88rpx;
		background: #fff;
	}
	.tab-item {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #eee;
		flex: 1;
		height: 88rpx;
		font-size: 28rpx;
		color: #646566;
		box-sizing: border-box;
		&-active {
			color: #121212;
		}
	}
	.tab-title {
		display: block;
		padding: 0 16rpx;
		width: 100%;
		box-sizing: border-box;
	    text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.tab-line {
		position: absolute;
		top: 82rpx;
		left: 0;
		width: 80rpx;
		height: 6rpx;
		background: #ee0a24;
		transform: translateX(147.5rpx);
		transition: all 0.3s linear;
	}
	.detail-img-wrapper {
	    width: 100%;
	}
	.rate-wrapper {
		padding: 32rpx;
		width: 100%;
		height: 667rpx;
		background: #fff;
		box-sizing: border-box;
	}
	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}
</style>
