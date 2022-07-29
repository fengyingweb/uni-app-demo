<template>
	<view class="wrapper">
		<view class="status_bar">
			<!-- 这里是非H5状态栏 -->
			<view class="status_bar-fixed"></view>
		</view>
		<view class="nav-bar-wrapper">
			<view class="nav-bar-fixed">
				<view class="nav-bar-con flex-row align-center">
					<view class="nav-bar-left">
						<uni-icons type="location" size="24" color="#fff"></uni-icons>
					</view>
					<view class="nav-bar-right">
						<uni-search-bar
						    v-model="searchVal"
							placeholder="请输入搜索关键词"
							cancelButton="none"
							bgColor="#fff"
							radius="100"
							@confirm="confirmSearch">
						</uni-search-bar>
					</view>
				</view>
			</view>
		</view>
		<view class="container">
			<!--start banner-->
			<view class="swiper-banner">
				<swiper
				  :indicator-dots="true"
				  :autoplay="true"
				  :circular="true"
				  :interval="3000"
				  indicator-active-color="#07c160">
					<swiper-item v-for="item in bannerLists" :key="item.goodsId" @click="clickGoods(item.goodsId)">
						<image class="swiper-item-img" :src="item.image" :lazy-load="true" mode="widthFix"></image>
					</swiper-item>
				</swiper>
			</view>
			<!--end banner-->
			
			<!--start category-->
			<view class="category-wrapper">
				<uni-grid :column="5" :showBorder="false">
					<uni-grid-item
					    v-for="item in categoryLists"
					    :key="item.mallCategoryId">
					    <view class="flex-column center grid-item-inner" @click="clickGrid(item.mallCategoryId)">
					    	<image class="grid-img" :src="item.image" :lazy-load="true" mode="aspectFit"></image>
							<text class="grid-text">{{item.mallCategoryName}}</text>
					    </view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<!--end category-->
			
			<!--start 公告-->
		    <view class="ad-banner-wrapper">
			    <image class="ad-img" :src="adBanner" :lazy-load="true" mode="aspectFit"></image>
		    </view>
		    <!--end 公告-->
			
			<!--start recommend-->
			<view class="recommend-wrapper">
				<text class="recommend-title">商品推荐</text>
				<scroll-view class="scroll-view-h" :scroll-x="true" :show-scrollbar="false">
					<view
					    v-for="(item, ind) in recommendGoods"
						:key="item.goodsId"
						:id="'recItem' + ind"
					    class="recommend-item"
						@click="clickGoods(item.goodsId)">
					    <image class="recommend-img" :src="item.image" :lazy-load="true" mode="aspectFit"></image>
					    <text class="recommend-desc">{{item.goodsName}}</text>
					    <text class="recommend-desc">￥{{item.price|moneyFilter}}(￥{{item.mallPrice|moneyFilter}})</text>
				    </view>
				</scroll-view>
			</view>
			<!--end recommend-->
			
			<!--start floor-->
			<view class="floor-wrapper">
				<u-floor :floor-title="floorName.floor1" :floor-data="floor1" @click="clickGoods"></u-floor>
				<u-floor :floor-title="floorName.floor2" :floor-data="floor2" @click="clickGoods"></u-floor>
				<u-floor :floor-title="floorName.floor3" :floor-data="floor3" @click="clickGoods"></u-floor>
			</view>
			<!--end floor-->
			
			<!--start hot goods-->
			<u-hot-goods title="热卖商品" :hot-goods-data="hotGoods" @click="clickGoods"></u-hot-goods>
			<!--end hot goods-->
		</view>
	</view>
</template>

<script>
import { queryAllGoodsIndex } from '@/http/api';
export default {
	data() {
		return {
			href: 'https://uniapp.dcloud.io/component/README?id=uniui',
			searchVal: '',
			bannerLists: [], // banner数据
			categoryLists: [], // 分类数据
			adBanner: '',
			recommendGoods: [], // 推荐商品数据
			floor1: [],
			floor2: [],
			floor3: [], // 楼层数据
			floorName: {}, // 楼层名称
			hotGoods:[], // 热门商品
		}
	},
	onLoad() {
		console.log('on load')
		this.initData();
	},
	filters: {
		moneyFilter(money) {
			return money.toFixed(2);
		}
	},
	methods: {
		// 初始化数据
		async initData() {
		    const res = await queryAllGoodsIndex();
			console.log(res);
			if (res.code === 0) {
				this.bannerLists = res.data.slides;
				this.categoryLists = res.data.category;
				this.adBanner = res.data.advertesPicture.PICTURE_ADDRESS;
				this.recommendGoods = res.data.recommend;
				this.floor1 = res.data.floor1;
				this.floor2 = res.data.floor2;
				this.floor3 = res.data.floor3;
				this.floorName = res.data.floorName;
				this.hotGoods = res.data.hotGoods;
			}
		},
		// 确定搜索
		confirmSearch(e) {
			console.log(e);
		},
		// 点击banner
		clickGoods(goodsId) {
			uni.navigateTo({
				url: `/pages/goodsDetail/goodsDetail?goodsId=${goodsId}`
			})
		},
		// 点击分类列表
		clickGrid(categoryId) {
			uni.setStorageSync('categoryId', categoryId)
			uni.switchTab({
				url: '/pages/category/category'
			})
		}
	}
}
</script>

<style lang="scss">
	.container {
		padding-bottom: 40rpx;
		font-size: 28rpx;
		color: #333;
	}
	.status_bar {
	    height: var(--status-bar-height);
	    width: 750rpx;
	}
	.status_bar-fixed {
		position: fixed;
		z-index: 998;
		left: var(--window-left);
		right: var(--window-right);
		height: var(--status-bar-height);
		width: 750rpx;
		background: #07c160;
	}
	.nav-bar-wrapper {
		width: 750rpx;
		height: 88rpx;
	}
	.nav-bar-fixed {
		position: fixed;
		z-index: 998;
		left: var(--window-left);
		right: var(--window-right);
		height: 88rpx;
		background: #07c160;
	}
	.nav-bar-con {
		padding: 0 32rpx;
		width: 750rpx;
		height: 88rpx;
		overflow: hidden;
	}
	.nav-bar-right {
		flex-basis: 75%;
	}
	.swiper-banner {
		width: 750rpx;
	}
	.swiper-item-img {
		display: block;
		width: 750rpx;
	}
	.category-wrapper {
		padding: 20rpx 0;
		width: 750rpx;
		background: #fff;
	}
	.grid-img {
		display: block;
	    margin-bottom: 6rpx;
		width: 97rpx;
		height: 97rpx;
	}
	.ad-banner-wrapper {
	    margin: 10rpx 0;
	    width: 750rpx;
	    background: #fff;
	}
	.ad-img {
	    display: block;
	    width: 100%;
		height: 66rpx;
	}
	.recommend-wrapper {
		width: 750rpx;
	}
	.recommend-title {
		display: block;
	    border-bottom: 1px solid #eee;
	    padding-top: 16rpx;
	    padding-bottom: 16rpx;
	    padding-left: 32rpx;
	    width: 750rpx;
	    background: #fff;
		font-size: 32rpx;
	    color: #f56;
	}
    .scroll-view-h {
		white-space: nowrap;
		width: 100%;
		background: #fff;
	}
	.recommend-item {
		display: inline-block;
		border-right: 1px solid #eee;
		width: 250rpx;
		background: #fff;
		text-align: center;
	}
	.recommend-img {
		width: 180rpx;
		height: 180rpx;
	}
	.recommend-desc {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		padding: 0 16rpx;
		width: 100%;
		white-space: normal;
		overflow: hidden;
		box-sizing: border-box;
	}
	.floor-wrapper {
		width: 750rpx;
	}
</style>
