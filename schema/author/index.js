
// 暂时用不到MongoDB
// import dbModel from '../../dbModel/index.js'
import api from '../../OSSAPI/index.js'
const articleHomeUrl = 'home/article'

let schemaInput = `
  input tagInput {
    text: String
  }
  input authorInput {
    id: String
    avator: String
    name: String
    desc: String
    tag: [tagInput]
  }
`
let schemaQuery = `
  type tag {
    text:  String
  }
  type author {
    id: ID
    avator: String
    name: String
    desc: String
    tag: [tag]
  }
`

let schema = schemaQuery + schemaInput

// 1.上级对象 2.提交的参数 3.ctx
let resolver = {
  Query: {
    async getAuthorList (obje, params) {
      const authorList = await api.getFile('home/json/authorList.json')
      var data = JSON.parse(authorList.content.toString('utf8'))
      return data
    }
  },
  Mutation: {
    async addAuthor (obj, { input }) {
      const authorList = await api.getFile('home/json/authorList.json')
      var data = JSON.parse(authorList.content.toString('utf8'))
      input.id = parseInt(+new Date() + ( Math.random() * 10000 )) + ''
      data.push(input)
      const result = await api.upload('home/json/authorList.json', Buffer.from(JSON.stringify(data)))
      if (result.res.status === 200) {
        return input
      }
    },
    async setAuthorList (obj, { input }) {
      const result = await api.upload('home/json/authorList.json', Buffer.from(JSON.stringify(input)))
      if (result.res.status === 200) {
        return input
      }
    },
    async deleteAuthor (obj, { id }) {
      const authorList = await api.getFile('home/json/authorList.json')
      var data = JSON.parse(authorList.content.toString('utf8'))
      var hadDelete = {}
      data = data.filter((item) => {
        if (item.id == id) {
          hadDelete = item
          return false
        }
        return true
      })
      const result = await api.upload('home/json/authorList.json', Buffer.from(JSON.stringify(data)))
      if (result.res.status === 200) {
        return hadDelete
      }
    }
  }
}

export default {
  schema,
  resolver,
};
