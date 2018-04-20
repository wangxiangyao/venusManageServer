
// 暂时用不到MongoDB
// import dbModel from '../../dbModel/index.js'
import api from '../../OSSAPI/index.js'
const articleHomeUrl = 'home/article'

// mainPic是主图，thumbnail是缩略图地址，url表示本文完整链接

let schemaInput = `
  input articleInput {
    id: ID
    title: String
    shareDesc: String
    shareTitle: String
    mainPic: [imgItemInput]
    thumbnail: [imgItemInput]
    url: String
    content: String
    author: authorInput
    updateAt: String
    createAt: String
  }
`
let schemaQuery = `
  type article {
    id: ID
    title: String
    shareDesc: String
    shareTitle: String
    url: String
    mainPic: [imgItem]
    thumbnail: [imgItem]
    content: String
    author: author
    updateAt: String
    createAt: String
  }
  type articleSummary {
    id: ID
    title: String
    url: String
    updateAt: String
    createAt: String
    author: author
  }
`

let schema = schemaQuery + schemaInput

// 1.上级对象 2.提交的参数 3.ctx
let resolver = {
  Query: {
    async getArticleList (obj, params) {
      const articleList = await api.getFile('home/json/articleList.json')
      var data = JSON.parse(articleList.content.toString('utf8'))
      return data
    },
    async getArticle (obje, { id }) {
      const article = await api.getFile(`home/article/${id}.json`)
      var data = JSON.parse(article.content.toString('utf8'))
      return data
    }
  },
  Mutation: {
    async saveArticle (obj, { input }) {
      const { id, title, url, author } = input
      const articleList = await api.getFile('home/json/articleList.json')
      var articleListData = JSON.parse(articleList.content.toString('utf8'))
      // 在文章list中，根据id找到需要更新的项，然后更新
      for (let key in articleListData) {
        if (articleListData[key].id === id) {
          let theArticle = articleListData[key]
          theArticle.title = title
          theArticle.url = url
          theArticle.author = author
          theArticle.updateAt = +new Date() + ''
          break
        }
      }
      input.updateAt = +new Date() + ''

      const result1 = await api.upload('home/json/articleList.json', Buffer.from(JSON.stringify(articleListData)))
      const result2 = await api.upload(`home/article/${id}.json`, Buffer.from(JSON.stringify(input)))
      if (result1.res.status === 200 && result2.res.status === 200) {
        return input
      } else {
        return {
          code: 'error',
          message: '没有做判断'
        }
      }
    },
    async addArticle (obj) {
      let time = +new Date() + ''
      let emptyArticle = {
        id: '',
        title: '',
        shareDesc: '',
        shareTitle: '',
        mainPic: [],
        thumbnail: [],
        url: '',
        content: '',
        updateAt: time,
        createAt: time,
        author: {} // TODO: 抽象出空数据模型，在需要的地方引入
      }
      const articleList = await api.getFile('home/json/articleList.json')
      var articleListData = JSON.parse(articleList.content.toString('utf8'))

      emptyArticle.id = parseInt(+new Date() + ( Math.random() * 10000 )) + ''
      emptyArticle.url = `http://venus-resource.oss-cn-shanghai.aliyuncs.com/${articleHomeUrl}/${emptyArticle.id}.json`
      const result = await api.upload(`home/article/${emptyArticle.id}.json`, Buffer.from(JSON.stringify(emptyArticle)))

      // input.id = Number(data[data.length - 1].id) + 1
      // data.push(input)
      // const result = await api.upload('home/json/authorList.json', Buffer.from(JSON.stringify(data)))
      if (result.res.status === 200) {
        articleListData.push({
          id: emptyArticle.id,
          title: emptyArticle.title,
          url: emptyArticle.url,
          author: emptyArticle.author,
          updateAt: emptyArticle.updateAt,
          createAt: emptyArticle.createAt
        })
        const result1 = await api.upload('home/json/articleList.json', Buffer.from(JSON.stringify(articleListData)))
        if (result1.res.status === 200) {
          return emptyArticle
        }
      }
    },
    async deleteArticle (obj, { id }) {
      const deleteArticle = await api.getFile(`home/article/${id}.json`)
      const articleList = await api.getFile('home/json/articleList.json')

      var articleListData = JSON.parse(articleList.content.toString('utf8'))
      var deleteArticleData = JSON.parse(deleteArticle.content.toString('utf8'))

      const result = await api.deleteFile(`${articleHomeUrl}/${id}.json`)
      var data = result.res.data.toString('utf8')
      if (result.res.status === 200 || result.res.status === 204) {
        // 如果删除成功，在列表中删除
        console.log('删除列表中的文章', id)
        let deleteIndex
        for (let key in articleListData) {
          if (articleListData[key].id === id) {
            deleteIndex = key
            break
          }
        }
        articleListData.splice(deleteIndex, 1)
        const result2 = await api.upload('home/json/articleList.json', Buffer.from(JSON.stringify(articleListData)))
        if (result2.res.status === 200) {
          return deleteArticleData
        }
      }
    }
  }
}


export default {
  schema,
  resolver,
};
