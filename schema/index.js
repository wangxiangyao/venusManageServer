import { makeExecutableSchema } from 'graphql-tools'
import Homepage from './Homepage/index.js'
import article from './article/index.js'
import author from './author/index.js'

const schema = {
  Homepage,
  article,
  author
}
let typeDefs = `
  schema {
    query: Query
    mutation: Mutation
  }
  type Query {
    getHomepage: Homepage
    getAuthorList: [author]
    getArticleList: [articleSummary]
    getArticle(id: String): article
  }
  type Mutation {
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
  console.log(resolvers)
}
const executableSchema  = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default executableSchema
