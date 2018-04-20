
// 暂时用不到MongoDB
// import dbModel from '../../dbModel/index.js'
import api from '../../OSSAPI/index.js'

// 模拟数据
class Homepage {
  constructor(id, { title, guesslike }) {
    this.id = id
    this.title = title
    this.guesslike = guesslike
  }
}

let mockDB = {}

let schemaInput = `
  input imgItemInput {
    url: String
  }

  input swiperInput {
    item: [swiperItemInput]
  }
  input swiperItemInput {
    type: String
    link: String
    img: [imgItemInput]
  }

  input guideInput {
    item: [guideItemInput]
  }
  input guideItemInput {
    type: String
    title: String
    link: String
    img: [imgItemInput]
  }

  input newproduceInput {
    main: newproduceMainInput
    item: [newproduceItemInput]
  }
  input newproduceMainInput {
    type: String
    link: String
  }
  input newproduceItemInput {
    type: String
    link: String
    img: [imgItemInput]
  }

  input starPrivilegeInput {
    item: [starPrivilegeItemInput]
  }
  input starPrivilegeItemInput {
    type: String
    link: String
    img: [imgItemInput]
  }

  input buyerrecommendInput {
    kind: String
    item: [buyerrecommendItemInput]
  }
  input buyerrecommendItemInput {
    author: authorInput
    title: String
    commodityId: String
    desc: String
    type: String
    link: String
    img: [imgItemInput]
  }

  input showInput {
    main: showMainInput
    item: [showItemInput]
  }
  input showMainInput {
    type: String
    link: String
    img: [imgItemInput]
  }
  input showItemInput {
    author: authorInput
    img: [imgItemInput]
    link: String
    message: String
    type: String
  }

  input threeSchemaInput {
    main: threeSchemaMainInput
    item: [threeSchemaItemInput]
  }
  input threeSchemaMainInput {
    type: String
    link: String
    img: [imgItemInput]
  }
  input threeSchemaItemInput {
    type: String
    link: String
    img: [imgItemInput]
  }

  input brandInput {
    main: brandMainInput
    item: [brandItemInput]
  }
  input brandMainInput {
    type: String
    link: String
  }
  input brandItemInput {
    type: String
    link: String
    img: [imgItemInput]
  }

  input guesslikeInput {
    swiper: [swiperItemInput]
    handbags: [guesslikeItemInput]
    travellife: [guesslikeItemInput]
    fulldress: [guesslikeItemInput]
    item: [guesslikeItemInput]
  }
  input guesslikeItemInput {
    id: String
  }

  input HomepageInput {
    id: ID
    swiper: swiperInput
    guide: guideInput
    newproduce: newproduceInput
    starPrivilege: starPrivilegeInput
    buyerrecommend: [buyerrecommendInput]
    show: showInput
    handbags: threeSchemaInput
    travellife: threeSchemaInput
    fulldress: threeSchemaInput
    brand: brandInput
    guesslike: guesslikeInput
  }
`
let schemaQuery = `
  type imgItem {
    url: String
  }


  type swiper {
    item: [swiperItem]
  }
  type swiperItem {
    type: String
    link: String
    img: [imgItem]
  }

  type guide {
    item: [guideItem]
  }
  type guideItem {
    type: String
    title: String
    link: String
    img: [imgItem]
  }

  type newproduce {
    main: newproduceMain
    item: [newproduceItem]
  }
  type newproduceMain {
    type: String
    link: String
  }
  type newproduceItem {
    type: String
    link: String
    img: [imgItem]
  }

  type starPrivilege {
    item: [starPrivilegeItem]
  }
  type starPrivilegeItem {
    type: String
    link: String
    img: [imgItem]
  }

  type show {
    main: showMain
    item: [showItem]
  }
  type showMain {
    type: String
    link: String
    img: [imgItem]
  }
  type showItem {
    author: author
    img: [imgItem]
    link: String
    message: String
    type: String
  }

  type buyerrecommend {
    kind: String
    item: [buyerrecommendItem]
  }
  type buyerrecommendItem {
    author: author
    title: String
    commodityId: String
    desc: String
    type: String
    link: String
    img: [imgItem]
  }

  type threeSchema {
    main: threeSchemaMain
    item: [threeSchemaItem]
  }
  type threeSchemaMain {
    type: String
    link: String
    img: [imgItem]
  }
  type threeSchemaItem {
    type: String
    link: String
    img: [imgItem]
  }

  type brand {
    main: brandMain
    item: [brandItem]
  }
  type brandMain {
    type: String
    link: String
  }
  type brandItem {
    type: String
    link: String
    img: [imgItem]
  }

  type guesslike {
    swiper: [swiperItem]
    handbags: [guesslikeItem]
    travellife: [guesslikeItem]
    fulldress: [guesslikeItem]
    item: [guesslikeItem]
  }
  type guesslikeItem {
    id: String
  }

  type Homepage {
    id: ID
    swiper: swiper
    guide: guide
    newproduce: newproduce
    starPrivilege: starPrivilege
    buyerrecommend: [buyerrecommend]
    show: show
    handbags: threeSchema
    travellife: threeSchema
    fulldress: threeSchema
    brand: brand
    guesslike: guesslike
  }
`

let schema = schemaQuery + schemaInput
const env = process.NODE_ENV
const dataName = env === 'production' ? 'main' : 'mainTest'
console.log(dataName);

// 1.上级对象 2.提交的参数 3.ctx
let resolver = {
  Query: {
    async getHomepage (obj, params) {
      const homepage = await api.getFile(`home/json/${dataName}.json`)
      var data = JSON.parse(homepage.content.toString('utf8'))
      return data
    }
  },
  Mutation: {
    async setHomepage (obj, { input }) {
      var guesslikeData = input.guesslike
      const result = await api.upload(`home/json/${dataName}.json`, Buffer.from(JSON.stringify(input)))
      
      // 商城首页和小程序的猜你喜欢同步
      if (env === 'production') {
        const miniHomepageBuffer = await api.getFile('home/json/miniMain.json')
        var miniHomepageData = JSON.parse(miniHomepageBuffer.content.toString('utf8'))
        miniHomepageData.guesslike = guesslikeData
        const resultUpdataMiniHomepage = await api.upload('home/json/miniMain.json', Buffer.from(JSON.stringify(miniHomepageData)))
      }
      if (result.res.status === 200) {
        return input
      }
    },
    async updateHomepage(obj, {id, input}) {
      // 弃用
      const updated = await dbModel.Homepage.findOneAndUpdate({
        _id: id,
      }, input0)
      console.log(updated)
      const homepage = await dbModel.Homepage.findOne({
        _id: id
      })
      return homepage
    }
  }
}

export default {
  schema,
  resolver,
};
