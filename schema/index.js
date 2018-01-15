import { makeExecutableSchema } from 'graphql-tools'
import Homepage from './Homepage/index.js'
let typeDefs = Homepage.schema
let resolvers = Homepage.resolver
const executableSchema  = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default executableSchema
