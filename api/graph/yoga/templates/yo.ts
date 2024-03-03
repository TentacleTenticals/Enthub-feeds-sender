import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefinitions = /* GraphQL */ `
  type Query {
    yo: String!
  }
`
const resolvers = {
  Query: {
    yo: () => 'Hello World!'
  }
}

export const yo = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})