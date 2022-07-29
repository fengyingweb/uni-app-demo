import http from './http'
import { allDatas } from '../mock'

// 获取首页商品信息
export function queryAllGoodsIndex() {
    return new Promise((resolve, reject)=> {
		resolve(allDatas[1].data);
	});
}

// 获取商品大类列表
export function queryCategoryList() {
    return http.get('/api/goods/getCategoryList', null);
}

// 获取商品小类数据
export function queryCategorySubList(params) {
    return http.post('/api/goods/getCategorySubList', params);
}

// 根据商品类别获取商品列表,分页查询
export function queryGoodsListByCategorySubID(params) {
    return http.post('/api/goods/getGoodsListByCategorySubID', params);
}

// 获取商品详情信息
export function queryDetailGoodsInfo(params) {
    return http.post('/api/goods/getDetailGoodsInfo', params);
}
