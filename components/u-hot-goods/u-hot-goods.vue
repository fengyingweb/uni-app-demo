<template>
	<view class="hot-wrapper">
	    <text class="hot-title">{{title}}</text>
	    <view class="hot-body">
	        <uni-row>
	            <uni-col
	                v-for="item in hotGoodsData"
	                :key="item.goodsId"
					:span="12">
					<view class="flex-column align-center hot-item" @click="clickHots(item.goodsId)">
						<image class="hot-img" :src="item.image" :lazy-load="true" mode="aspectFit"></image>
						<text class="hot-desc">{{item.name}}</text>
						<text>￥{{item.price|moneyFilter}}</text>
					</view>
	            </uni-col>
	        </uni-row>
	    </view>
	</view>
</template>

<script>
export default {
	name: 'UHotGoods',
	emits:['click'],
	props: {
		title: {
			type: String,
			default: ''
		},
		hotGoodsData: Array
	},
	filters: {
		moneyFilter(money) {
		    return money.toFixed(2);
		}
	},
	methods: {
		clickHots(id) {
		    this.$emit('click', id);
		}
	}
}
</script>

<style lang="scss">
	.hot-wrapper {
	    width: 750rpx;
	}
	  .hot-title {
		  display: block;
		  width: 100%;
	      line-height: 72rpx;
	      text-align: center;
	      color: #333;
	  }
	  .hot-body {
	      width: 100%;
	  }
	  .hot-item {
		  border-bottom: 1px solid #eee;
	      width: 375rpx;
		  background: #fff;
		  box-sizing: border-box;
	  }
	  .hot-img {
	      display: block;
	      width: 320rpx;
		  height: 320rpx;
	  }
	  .hot-desc {
	      width: 320rpx;
	      line-height: 48rpx;
	      text-align: center;
	      font-size: 28rpx;
	      color: #333;
	      white-space: nowrap;
	      text-overflow: ellipsis;
	      overflow: hidden;
	  }
</style>
