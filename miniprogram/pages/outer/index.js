// pages/outer/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 页面加载时setData
   */
  onLoad(options) {
    this.setData({
        src: decodeURIComponent(options.src)
    })
  },

})