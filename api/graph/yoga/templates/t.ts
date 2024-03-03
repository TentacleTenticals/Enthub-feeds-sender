import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefinitions = /* GraphQL */ `
  type Query {
    sup: String!
  }
`
const resolvers = {
  Query: {
    sup: () => 'Hello World!'
  }
}

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})