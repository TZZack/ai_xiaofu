const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
//   const { keyword, category, date } = event
//   const start = new Date(date)
//   let matchObj = {
//     create_time: db.command.gte(start).and(db.command.lt(new Date(start.getTime() + 24 * 60 * 60 * 1000)))
//   }
//   if (keyword) {
//     matchObj.title = db.RegExp({
//         regexp: keyword,
//         options: 'i'
//     })
//   }
//   if (category !== 'all') {
//     matchObj.type = category
//   }
  const { category } = event
  let result
  if (category === 'all') {
    result = await db.collection('articles').orderBy('create_time', 'desc').get()
  } else {
    const matchObj = {
        type: category
    }
    result = await db.collection('articles').where(matchObj).orderBy('create_time', 'desc').get()
  }
  return result.data
}