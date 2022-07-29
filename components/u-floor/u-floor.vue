<template>
	<view class="floor">
	    <text class="floor-title">{{floorTitle}}</text>
	    <view v-if="floorData.length > 0" class="floor-body">
	        <view class="flex-row floor-top">
	            <view class="floor-item right-b" @click="clickFloor(floorData[0].goodsId)">
	                <image class="floor-img floor-img-big" :src="floorData[0].image" :lazy-load="true" mode="aspectFit"></image>
	            </view>
	            <view class="floor-item">
	                <view class="floor-item" @click="clickFloor(floorData[1].goodsId)">
	                    <image class="floor-img" :src="floorData[1].image" :lazy-load="true" mode="aspectFit"></image>
	                </view>
	                <view class="floor-item" @click="clickFloor(floorData[2].goodsId)">
	                    <image class="floor-img" :src="floorData[2].image" :lazy-load="true" mode="aspectFit"></image>
	                </view>
	            </view>
	        </view>
	        <view class="flex-row floor-bottom">
	            <view
	                v-for="(item, ind) in floorData.slice(3)"
	                :key="item.goodsId"
	                :class="['floor-item', ind === 0 && 'right-b']"
	                @click="clickFloor(item.goodsId)">
	                <image class="floor-img" :src="item.image" :lazy-load="true" mode="aspectFit"></image>
	            </view>
	        </view>
	    </view>
	</view>
</template>

<script>
export default {
	name: 'UFloor',
	emits: ['click'],
	props: {
		floorTitle: {
			type: String,
			default: ''
		},
		floorData: Array
	},
	methods: {
		clickFloor(id) {
		    this.$emit('click', id);
		}
	}
}
</script>

<style lang="scss">
	  .floor {
	      width: 100%;
	  }
	  .floor-title {
		  display: block;
		  width: 100%;
	      line-height: 72rpx;
	      text-align: center;
		  font-size: 32rpx;
	      color: #333;
	  }
	  .floor-body {
	      width: 100%;
	      background: #fff;
	  }
	  .floor-item {
	    flex: 1;
	    border-bottom: 1px solid #eee;
	  }
	  .right-b {
	    border-right: 1px solid #eee;
	  }
	  .floor-img {
	    display: block;
	    width: 100%;
		height: 194rpx;
		&-big {
		  height: 388rpx;
	    }
	  }
</style>
