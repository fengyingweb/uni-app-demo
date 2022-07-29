import URequest from './request.js';
let http = new URequest();

http = http.create({
    baseUrl: 'http://localhost:3001',
    timeout: 10000
});

// 请求拦截
http.interceptor.request((config) => {
    return config;
});

// 响应拦截
http.interceptor.response(res => {
    if (res.data && res.data.code !== 0 && res.statusCode !== 200) {
	  uni.showToast({
		  icon: 'fail',
		  title: res.data.msg
	  })
    }
    return res.data;
})
export default http;