class URequest {
  config = {
    baseUrl: '',
    timeout: 5000,
    header: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    dataType: 'json',
    responseType: 'text',
    method: 'GET',
    success() { },
    fail() { },
    complete() { }
  }

  create(config = {}) {
    this.config = { ...this.config, ...config };
    return this;
  }

  static validateUrl(url) {
    /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
  }

  static requestBeforeFun(config) {
    return config;
  }

  static requestCompleteFun(response) {
    return response;
  }

  // 设置拦截器
  interceptor = {
    request(fn) {
      if (fn) {
        URequest.requestBeforeFun = fn;
      }
    },

    response(fn) {
      if (fn) {
        URequest.requestCompleteFun = fn;
      }
    }
  }

  request(options = {}) {
    options.baseUrl = options.baseUrl || this.config.baseUrl;
    options.timeout = options.timeout || this.config.timeout;
    options.header = options.header || this.config.header;
    options.dataType = options.dataType || this.config.dataType;
    options.responseType = options.responseType || this.config.responseType;
    options.method = options.method || this.config.method;
    options.url = URequest.validateUrl(options.url)
      ? options.url
      : options.baseUrl + options.url;
    options.data = options.data || {};
    return new Promise((resolve, reject) => {
      let _config = null;

      options.complete = response => {
        let statusCode = response.statusCode;
        response.config = _config;
        response = URequest.requestCompleteFun(response);
        console.log('request complete: ', response);
        if (statusCode === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      }

      let mergeConfig = { ...this.config, ...options };
      _config = { ...mergeConfig, ...URequest.requestBeforeFun(mergeConfig) };
      uni.request(_config);
    })
  }

  get(url, data, options = {}) {
    options.url = url;
    options.data = data;
    options.method = 'GET';
    return this.request(options);
  }

  post(url, data, options = {}) {
    options.url = url;
    options.data = data;
    options.method = 'POST';
    return this.request(options);
  }
}

export default URequest;