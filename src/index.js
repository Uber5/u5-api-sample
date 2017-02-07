import { join } from 'path'
import express from 'express'
import { makeExecutableSchema, addResolveFunctionsToSchema } from 'graphql-tools'
import { log, types, configureEndpoint, getLiteralTypes, getResolvers } from 'u5-api-base'
import { mongo, ensureIndexes } from './db'

const app = express()

const queries = `
  type Queries {
    team(id: ID!): Team
    teams: [Team]

    player(id: ID!): Player
    players(teamId: ID): [Player]
  }
`

const mutations = `
  type Mutations {
    createTeam(input: TeamInput): Team
    createPlayer(input: PlayerInput, addToTeamId: ID): Player
    updateTeam(input: TeamInput, id: ID!): Team
    updatePlayer(input: PlayerInput, id: ID!): Player
    addPlayerToTeam(teamId: ID!, playerId: ID!): Player
    removePlayerFromTeam(teamId: ID!, playerId: ID!): Player
    archivePlayer(id: ID!): Player
  }
`

const schemaDefinition = `

  enum Level {
    None
    Basic
    Average
    VeryGood
    Excellent
  }

  scalar DateTime

  schema {
    query: Queries
    mutation: Mutations
  }
`

const typeDefs = getLiteralTypes({
  fromDir: join(__dirname, './types'),
  types: [ schemaDefinition, queries, mutations ]
})

const resolvers = getResolvers({
  fromDir: join(__dirname, './resolvers')
})

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

addResolveFunctionsToSchema(schema, {
  DateTime: types.DateTime
})

const endpoint = configureEndpoint({
  schema
})
app.use('/api', endpoint);

// listen as a server
const port = process.env.PORT || 4000
app.listen(port, () => {
  log('listening on port', port)
});

// log the database name (or bail, if we cannot connect)
mongo
.then(db => log('connected to', db.databaseName))
.catch(e => { log(e); process.exit(1) })

// ensure mongodb indexes (or bail)
ensureIndexes()
.then(() => log('mongodb indexes updated'))
.catch(e => { log(e); process.exit(1) })
