import Homepage from './Homepage.js'
import configs from '../config/index.js'
import mongoose from 'mongoose'
// 链接数据库
var db = mongoose.createConnection(['mongodb://', configs.mongodb.ip, '/', configs.mongodb.dbname].join(''));

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(callback) {
  console.log('connection success')
})

export default {
  Homepage: db.model('Homepage', Homepage)
}
