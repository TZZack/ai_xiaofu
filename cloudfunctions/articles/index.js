const getList = require('./getList/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.type) {
    case 'getList':
      return await getList.main(event, context)
  }
}