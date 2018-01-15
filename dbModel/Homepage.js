import { Schema } from 'mongoose'
import {
  swiperItem,
  guideItem,
  newproduceItem,
  showItem,
  buyerrecommendItem,
  handbagItem,
  travellifeItem,
  fulldressItem
} from './commonSchema.js'

var Homepage = new Schema({
  swiper: [swiperItem],
  guide: [guideItem],
  newproduce: [newproduceItem],
  show: [showItem],
  buyerrecommend: [buyerrecommendItem],
  handbag: [handbagItem],
  travellife: [travellifeItem],
  fulldress: [fulldressItem],
  guesslike: [Number]
});

export default Homepage
