//app.js
App({
  globalData:{
    userInfo: null,
    dpr: 1,
    screenWidth:null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.dpr = res.pixelRatio;
      }
    });
  },
  sendRequest: function (options) {
    // 设置默认请求地址，可配置统一域名
    // options.url = options.url;
    // 设置默认请求data参数
    options.data = options.data || {};
    // 设置请方式并转换大写
    options.type = options.type ? options.type.toUpperCase() : "GET";
    if (options.header) options.header = options.header || {};
    wx.request({
      url: options.url,
      data: options.data,
      method: options.type,
      header: options.header,
      success: function (res) {
        options.success && options.success(res)
      },
      complete: function () {
        options.complete && options.complete()
      },
      error: function (err) {
        options.error && options.error(err)
      }
    })
  }
})