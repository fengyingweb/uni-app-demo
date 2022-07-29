<template>
	<view class="wrapper">
		<scroll-view class="tab-wrapper" :scroll-x="true" :show-scrollbar="false">
			<view
			    v-for="(item, ind) in category"
				:key="item.ID"
				:class="['tab-item', (activeTab === ind) && 'tab-item-active']"
				@click="clickTab(item.ID, ind)">
				<text class="tab-title">{{item.MALL_CATEGORY_NAME}}</text>
			</view>
			<view class="tab-line" :style="tabLineStyle"></view>
		</scroll-view>
		<view class="tab-content">
			<uni-row>
				<uni-col :span="6">
					<view class="tab-main col-left" :style="tabConStyle">
						<view
						    v-for="item in categorySub"
							:key="item.ID"
						    :class="['left-item', categorySubId === item.ID && 'active-left']"
							@click="clickCategorySub(item.ID)">
							<text>{{item.MALL_SUB_NAME}}</text>
						</view>
					</view>
				</uni-col>
				<uni-col class="tab-col" :span="18">
					<scroll-view
					    class="tab-main col-right"
						scroll-y="true"
						:style="tabConStyle"
						:show-scrollbar="false"
						:refresher-enabled="true"
						:refresher-triggered="refreshering"
						lower-threshold="50"
						:refresher-threshold="50"
						@scrolltolower="scrollLoadMore"
						@refresherrefresh="onRefresher">
						<uni-row>
							<uni-col
							    v-for="(item, ind) in goodList"
								:key="item.ID"
							    :span="12">
								<view
								    :class="['flex-column', 'align-center', 'goods-item', ind%2 === 0 && 'right-bd']"
									@click="clickGoods(item.ID)">
									<image class="goods-img" :src="item.IMAGE1" :lazy-load="true" mode="aspectFit"></image>
									<text class="goods-desc">{{item.NAME}}</text>
									<text class="goods-price">￥{{item.PRESENT_PRICE|moneyFilter}}</text>
								</view>
							</uni-col>
						</uni-row>
						<uni-load-more :status="loadMoreState"></uni-load-more>
					</scroll-view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
import { queryCategoryList, queryCategorySubList, queryGoodsListByCategorySubID} from '@/http/api';
export default {
	data() {
		return {
			categoryId: uni.getStorageSync('categoryId') || '', // 大类id
			categorySubId: '', // 子类id
			category: [], // 大类别
			categorySub: [], // 小类别
			goodList: [], // 商品列表
			activeTab: 0, // 选中的tab
			loadingSub: false, // 加载子类
			loadingGoods: false, // 加载商品
			refreshering: false, // 下拉刷新
			finished: false, // 商品是否已全部加载完
			loadingMore: false, // 上拉加载
			page: {
			    pageNo: 1,
			    pageSize: 8
			},
			windowHeight: 667, // 可用窗口高度
			tabConHeight: 0,
			tabItemWidth: 0,
			tabLineWidth: 0,
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
		tabConStyle() {
			// #ifndef MP-WEIXIN
			return {
				height: `${this.tabConHeight}px`
			}
			// #endif
			
			// #ifdef MP-WEIXIN
			let style = `height: ${this.tabConHeight}px`
			return style
			// #endif
		},
		loadMoreState() {
			let status = 'more';
			if (this.loadingMore && !this.finished) {
			    status = 'loading';
			} else if (this.finished) {
				status = 'noMore'
			}
			return status;
		}
	},
	filters: {
		moneyFilter(money) {
			return money.toFixed(2);
		}
	},
	onLoad() {
		console.log('on load')
	},
	onShow() {
		console.log('on show')
		this.initData();
	},
	onUnload() {
		clearTimeout(this.timer);
	},
	mounted() {
		console.log('mounted');
		this.initData(true);
	},
	methods: {
		// 获取元素属性
		getDomAttr() {
			const queryDom = uni.createSelectorQuery().in(this);
			const tabItemEle = queryDom.select('.tab-item-active');
			const tabLineEle = queryDom.select('.tab-line');
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
			tabItemEle.boundingClientRect(tabItemData=> {
				this.tabConHeight = this.windowHeight - tabItemData.height;
				this.tabItemWidth = tabItemData.width;
			}).exec();
			tabLineEle.boundingClientRect(lineData=> {
				this.tabLineWidth = lineData.width;
			}).exec();
		},
		// 初始化数据
		async initData(isQueryDom = false) {
			uni.showLoading({
				title: '加载中'
			});
			this.categoryId = uni.getStorageSync('categoryId') || '';
			this.goodList = [];
			this.activeTab = this.categoryId ? (Number(this.categoryId) - 1) : 0;
			this.page.pageNo = 1;
			const categoryRes = await queryCategoryList();
			if (categoryRes.code === 0) {
				this.category = categoryRes.data || [];
				this.categoryId = this.categoryId || this.category[0].ID;
				this.getCategorySubList();
			}
			if (isQueryDom) {
				this.$nextTick(()=> {
					this.getDomAttr();
				})
			}
		},
		// 获取商品子类数据
		async getCategorySubList() {
			if (this.loadingSub) return;
		    this.loadingSub = true;
			const params = {
				categoryId: this.categoryId,
			};
			uni.showLoading({
				title: '加载中'
			});
			const subRes = await queryCategorySubList(params);
			this.loadingSub = false;
			if (subRes.code === 0) {
				this.categorySub = subRes.data || []
				this.categorySubId = this.categorySub[0].ID;
				this.getGoodsListByCategorySubID();
			}
		},
		// 分页查询获取子类商品
		async getGoodsListByCategorySubID() {
			if (this.loadingGoods) return;
			this.loadingGoods = true;
			const params = {
				...this.page,
				categorySubId: this.categorySubId
			};
			const goodsRes = await queryGoodsListByCategorySubID(params);
			this.loadingGoods = false;
			this.timer = setTimeout(()=> {
				uni.hideLoading();
			}, 1000);
			if (goodsRes.code === 0) {
				this.finished = goodsRes.data.list.length <=0 ? true : false;
				if (this.refreshering) {
					this.goodList = [...goodsRes.data.list, ...this.goodList];
				} else {
					this.goodList = [...this.goodList, ...goodsRes.data.list];
				}
			}
			this.refreshering = false;
			this.loadingMore = false;
		},
		// 下拉刷新
		onRefresher() {
			console.log('refresher')
			this.refreshering = true;
			this.loadMoreGoods();
		},
		// 上拉加载
		scrollLoadMore() {
			console.log('load more')
			this.loadingMore = true;
			this.loadMoreGoods();
		},
		// 刷新商品数据
		loadMoreGoods() {
			this.page.pageNo += 1;
			this.getGoodsListByCategorySubID();
		},
		// 点击tab
		clickTab(id, ind) {
			this.categoryId = id;
			this.activeTab = ind;
			this.page.pageNo = 1;
			this.goodList = [];
			this.getCategorySubList();
		},
		// 点击子类
		clickCategorySub(id) {
		    this.categorySubId = id;
		    this.page.pageNo = 1;
		    this.goodList = [];
		    uni.showLoading({
				title: '加载中'
			});
		    this.getGoodsListByCategorySubID();
	    },
		// 点击商品
		clickGoods(goodsId) {
			uni.navigateTo({
				url: `/pages/goodsDetail/goodsDetail?goodsId=${goodsId}`
			})
		},
    }
}
</script>

<style lang="scss">
	.tab-wrapper {
		position: relative;
		white-space: nowrap;
		width: 100%;
		height: 88rpx;
		background: #fff;
	}
	.tab-item {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #eee;
		width: 150rpx;
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
		transform: translateX(35rpx);
		transition: all 0.3s linear;
	}
	.tab-content {
		width: 750rpx;
		box-sizing: border-box;
	}
	.tab-main {
		padding-bottom: 20rpx;
		height: 1058rpx;
		background: #fff;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.col-left {
	    border-right: 1px solid #eee;
	    width: 100%;
	}
	.left-item {
	    border-bottom: 1px solid #eee;
	    width: 100%;
	    line-height: 72rpx;
	    text-align: center;
	    font-size: 28rpx;
	    color: #333;
	    transition: all .5s;
	}
	.active-left {
	    border-bottom-color: #07c160;
	    background: #07c160;
	    color: #fff;
	}
	.col-right {
		width: 100%;
	}
	.goods-item {
		border-bottom: 1px solid #eee;
		padding: 16rpx 0;
		width: 100%;
		box-sizing: border-box;
	}
	.goods-img {
		display: block;
		width: 200rpx;
		height: 200rpx;
	}
	.right-bd {
		border-right: 1px solid #eee;
	}
	.goods-desc {
	    width: 80%;
	    line-height: 48rpx;
	    text-align: center;
	    font-size: 28rpx;
	    color: #333;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.goods-price {
		color: #ee0a24;
	}
</style>
