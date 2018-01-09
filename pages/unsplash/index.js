// pages/unsplash/index.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reqUrl: 'https://unsplash.com/napi/feeds/home',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getPicInfo()
  },

  /** 
   * 获取图片
   */
  getPicInfo: function (type) {
    let that = this;
    app.sendRequest({
      url: this.data.reqUrl,
      header: {
        Authorization: 'Client-ID c94869b36aa272dd62dfaeefed769d4115fb3189a9d1ec88ed457207747be626'
      },
      success: function (res) {
        let result = [];
        // 上拉刷新清空数据列表
        if (type === 'top') {
          that.setData({
            list: []
          });
          wx.stopPullDownRefresh();
        }
        res.data.photos.map((item, index) => {
          let w = Math.round(app.globalData.screenWidth * 1.12);
          let h = Math.round(item.height / item.width * w);
          result[index] = {
            id: item.id,
            name: item.user.name,
            desc: item.description,
            width: app.globalData.screenWidth,
            height: Math.round(item.height / item.width * app.globalData.screenWidth),
            imgUrl: item.urls.raw + '?dpr=' + app.globalData.dpr +'&auto=format&fit=crop&w='+w+'&h='+h+'&q=60&cs=tinysrgb'
          } 
        })
        that.data.reqUrl = res.data.next_page
        that.setData({
          list: that.data.list.concat(result)
        });
        wx.hideLoading();
      },
      error: function (err) {
        console.log(res);
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.reqUrl = 'https://unsplash.com/napi/feeds/home';
    this.getPicInfo('top')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多'
    });
    this.getPicInfo('bottom');
  },
  /**
   * 图片预览
   */
  imgPreview: function (e) {
    console.log(e);
    let imgUrl = e.currentTarget.dataset.imgUrl;
    console.log(imgUrl);
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    });
  }
})