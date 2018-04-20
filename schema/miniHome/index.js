
// 暂时用不到MongoDB
// import dbModel from '../../dbModel/index.js'
import api from '../../OSSAPI/index.js'

let schemaInput = `
  input topicInput {
    main: topicMainInput
    item: [topicItemInput]
  }
  input topicMainInput {
    type: String
    title: String
    desc: String
    img: [imgItemInput]
  }
  input topicItemInput {
    id: String
  }
  input miniHomepageInput {
    id: ID
    swiper: swiperInput
    guide: guideInput
    topic: [topicInput]
    guesslike: guesslikeInput
  }
`
let schemaQuery = `
  type topic {
    id: String
    main: topicMain
    item: [topicItem]
  }
  type topicMain {
    type: String
    title: String
    desc: String
    img: [imgItem]
  }
  type topicItem {
    id: String
  }
  type miniHomepage {
    id: ID
    swiper: swiper
    guide: guide
    topic: [topic]
    guesslike: guesslike
  }
`

let schema = schemaQuery + schemaInput

// 1.上级对象 2.提交的参数 3.ctx
let resolver = {
  Query: {
    async getMiniHomepage (obj, params) {
      const miniHomepageBuffer = await api.getFile('home/json/miniMain.json')
      var miniHomepageData = JSON.parse(miniHomepageBuffer.content.toString('utf8'))
      return miniHomepageData
    }
  },
  Mutation: {
    async setMiniHomepage (obj, { input }) {
      var guesslikeData = input.guesslike
      const resultUpdataMiniHomepage = await api.upload('home/json/miniMain.json', Buffer.from(JSON.stringify(input)))


      // 商城首页和小程序的猜你喜欢同步
      // const homepageBuffer = await api.getFile('home/json/main.json')
      // var homepageData = JSON.parse(homepageBuffer.content.toString('utf8'))
      // homepageData.guesslike = guesslikeData
      // const resultUpdataHomepage = await api.upload('home/json/main.json', Buffer.from(JSON.stringify(homepageData)))
      console.log(resultUpdataMiniHomepage, resultUpdataHomepage)
      if (resultUpdataMiniHomepage.res.status === 200) {
        return input
      }
    }
  }
}

export default {
  schema,
  resolver,
};
