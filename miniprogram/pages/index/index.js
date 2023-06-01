const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    articleGroupList: []
  },

  onLoad() {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'articles',
      data: {
        type: 'getList'
      }
    }).then(res => {
      const articleList = res.result.data
      const articleGroupObj = {}
      articleList.forEach(article => {
        if (articleGroupObj[article.type]) {
          articleGroupObj[article.type].list.push(article)
        } else {
          articleGroupObj[article.type] = {
            name: article.type,
            list: [article],
          }
        }
      })
      this.setData({
        articleGroupList: Object.values(articleGroupObj),
      })
      wx.hideLoading()
    }).catch((e) => {
      console.error(e)
      wx.hideLoading()
    })
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },
});
