// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const articleList = event.data
  if (!articleList) {
    return null
  }
  const typeList = await db.collection('article-type').get().data
  articleList.forEach(article => {
      article.create_time = article.create_time ? new Date(article.create_time) : new Date()
      const targetType = typeList.find(item => item.alias === article.type)
      if (targetType) {
        article.type = targetType.value
      } else {
        article.type = 4 // 其他
      }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}