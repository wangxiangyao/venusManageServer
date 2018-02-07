
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

  input buyerrecommendInput {
    item: [buyerrecommendItemInput]
  }
  input buyerrecommendItemInput {
    author: authorInput
    type: String
    link: String
    img: [imgItemInput]
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

  input guesslikeInput {
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
    show: showInput
    buyerrecommend: buyerrecommendInput
    handbags: threeSchemaInput
    travellife: threeSchemaInput
    fulldress: threeSchemaInput
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
    item: [buyerrecommendItem]
  }
  type buyerrecommendItem {
    author: author
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

  type guesslike {
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
    show: show
    buyerrecommend: buyerrecommend
    handbags: threeSchema
    travellife: threeSchema
    fulldress: threeSchema
    guesslike: guesslike
  }
`

let schema = schemaQuery + schemaInput

// 1.上级对象 2.提交的参数 3.ctx
let resolver = {
  Query: {
    async getHomepage (obj, params) {
      const homepage = await api.getFile('home/json/main.json')
      var data = JSON.parse(homepage.content.toString('utf8'))
      return data
    }
  },
  Mutation: {
    async setHomepage (obj, { input }) {
      const result = await api.upload('home/json/main.json', Buffer.from(JSON.stringify(input)))
      console.log(result)
      if (result.res.status === 200) {
        return input
      }
    },
    async updateHomepage(obj, {id, input}) {
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
