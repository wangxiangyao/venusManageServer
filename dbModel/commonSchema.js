import { Schema } from 'mongoose'

// 首页分模块
// 轮播模块
export const swiperItem = new Schema({
  link: String, // 链接到的文章
  src: String,  // 图片的地址
})
export const guideItem = new Schema({
  title: String, // 标题
  link: String,
  img: String
})
export const newproduceItem = new Schema({
  link: String,
  src: String
})
export const author = new Schema({
  avator: String,
  name: String,
  desc: String,
  tag: [String]
})
export const showItem = new Schema({
  author: author,
  imgs: [String],
  moreLink: String,
  message: String,
  commodityId: Number
})
export const buyerrecommendItem = new Schema({
  author: author,
  src: String,
  link: String
})
export const handbagItem = new Schema({
  mainimg: String,
  mainlink: String,
  commoditys: [Number]
})
export const travellifeItem = new Schema({
  mainimg: String,
  mainlink: String,
  commoditys: [Number]
})
export const fulldressItem = new Schema({
  mainimg: String,
  mainlink: String,
  commoditys: [Number]
})
