import { makeExecutableSchema } from 'graphql-tools'
import Homepage from './Homepage/index.js'
import article from './article/index.js'
import author from './author/index.js'
import miniHomepage from './miniHome/index.js'

const schema = {
  Homepage,
  article,
  author,
  miniHomepage
}
let typeDefs = `
  schema {
    query: Query
    mutation: Mutation
  }
  type Query {
    getHomepage: Homepage
    getMiniHomepage: miniHomepage
    getAuthorList: [author]
    getArticleList: [articleSummary]
    getArticle(id: String): article
  }
  type Mutation {
    setMiniHomepage(input: miniHomepageInput): miniHomepage
    setHomepage(input: HomepageInput): Homepage
    updateHomepage(input: HomepageInput): Homepage
    addAuthor(input: authorInput): author
    setAuthorList(input: [authorInput]): [author]
    saveArticle(input: articleInput): article
    addArticle: article
    deleteArticle(id: String): article
    deleteAuthor(id: String): author
  }
`
let resolvers = {}

for (let [key, val] of Object.entries(schema)) {
  typeDefs += val.schema
  resolvers.Query = Object.assign({}, resolvers.Query, val.resolver.Query)
  resolvers.Mutation = Object.assign({}, resolvers.Mutation, val.resolver.Mutation)
}
const executableSchema  = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default executableSchema
