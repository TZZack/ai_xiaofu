const { encodeDate } = require('../../utils');

const allType = {
    value: 'all',
    alias: '全部'
}

Page({
  data: {
    articleList: [],
    curDate: encodeDate(new Date(), 'Y-m-d'),
    dateVisible: false,
    start: '2022-01-01 00:00:00',
    end: encodeDate(new Date(), 'Y-m-d'),
    defaultType: allType.value,
    curType: allType.value,
    typeList: [],
    keyword: ''
  },

  onLoad() {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
        name: 'articles',
        data: {
            type: 'getTypes'
        }
    }).then(res => {
        const data = res.result.data
        data.unshift({
            value: allType.value,
            alias: allType.alias
        })
        this.setData({
            typeList: data
        })
    }).catch(err => {
        console.error(e)
    })
    this.getArticleList()
  },

  // TODO：暂时先隐藏掉关键字和日期这两个检索条件
  getArticleList() {
    wx.cloud.callFunction({
        name: 'articles',
        data: {
          type: 'getList',
        //   keyword: this.data.keyword,
          category: this.data.curType,
        //   date: this.data.curDate
        }
      }).then(res => {
        const data = res.result
        data.forEach(item => {
            item.labels = item.labels ? item.labels.split(',') : []
            item.create_time = encodeDate(new Date(item.create_time), 'Y-m-d H:i')
        })
        this.setData({
          articleList: data
        })
        wx.hideLoading()
      }).catch((e) => {
        wx.hideLoading()
      })
  },

  onSearch() {
    this.getArticleList()
  },
  onClear() {
    this.getArticleList()
  },

  typeChange (e) {
    this.setData({
        curType: e.detail.value
    })
    this.getArticleList()
  },

  showPicker() {
    this.setData({
        dateVisible: true,
    })
  },
  hidePicker() {
    this.setData({
        dateVisible: false,
    })
  },
  onDateConfirm(e) {
    this.setData({
        curDate: e.detail.value
    })
    this.getArticleList()
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/outer/index?src=${encodeURIComponent(e.currentTarget.dataset.link)}`,
    });
  },
});
