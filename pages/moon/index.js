// pages/unsplash/index.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0', // 当前tab
    reqUrl: 'https://unsplash.com/napi/collections/featured', // 当前请求url
    paging: {
      idnex: 1,
      size: 10
    },
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getNewPicInfo()
  },
  // 点击切换tab
  swichNav: function (e) {
    let that = this;
    console.log(that.data.currentTab === e.target.dataset.current)
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else if (e.target.dataset.current === '0') {
      that.data.reqUrl = 'https://unsplash.com/napi/collections/featured';
      that.getTrendingPicInfo('top');
    } else {
      that.data.reqUrl = 'https://unsplash.com/napi/collections/curated';
      that.data.paging.index = 1;
      that.getNewPicInfo('top')
    }
    that.setData({
      currentTab: e.target.dataset.current
    });
  },
  /** 
   * 获取New图片
   */
  getNewPicInfo: function (type) {
    let that = this;
    app.sendRequest({
      url: this.data.reqUrl,
      data: {
        page: this.data.paging.index,
        per_page: this.data.paging.size
      },
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
          // 请求成功关闭加载动画
          wx.stopPullDownRefresh();
        }
        // 遍历取出需要的数据
        res.data.map((item, index) => {
          let w = Math.round(app.globalData.screenWidth * 1.12); // 图片宽度相对屏幕宽度的比例
          let h = Math.round(item.height / item.width * w); // 计算出图片的高度
          result[index] = {
            id: item.id,
            name: item.user.name,
            userImg: item.user.profile_image.small,
            desc: item.description,
            width: app.globalData.screenWidth,
            height: Math.round(item.height / item.width * app.globalData.screenWidth),
            imgUrl: item.urls.raw + '?dpr=' + app.globalData.dpr + '&auto=format&fit=crop&w=' + w + '&h=' + h + '&q=60&cs=tinysrgb'
          }
        })
        // 重新设置请求地址
        that.data.reqUrl = res.data.next_page
        // 添加数据
        that.setData({
          list: that.data.list.concat(result)
        });
        // 关闭加载动画
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
    if (this.data.currentTab === '0') {
      this.data.reqUrl = 'https://unsplash.com/napi/feeds/home';
      this.getTrendingPicInfo('top')
    } else {
      this.data.paging.index = 1;
      this.data.reqUrl = 'https://unsplash.com/napi/photos';
      this.getNewPicInfo('top')
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多'
    });
    if (this.data.currentTab === '0') {
      this.getTrendingPicInfo('bottom');
    } else {
      this.data.paging.index++;
      this.getNewPicInfo('bottom');
    }
  },
  /**
   * 图片预览
   */
  imgPreview: function (e) {
    console.log(e);
    let imgUrl = e.currentTarget.dataset.imgUrl;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    });
  }
})