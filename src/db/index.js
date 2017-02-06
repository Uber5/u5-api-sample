import { MongoClient } from 'mongodb'
import * as R from 'ramda'
import { graphql } from 'graphql'
import { ObjectId } from 'mongodb'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/u5-api-base-sample'
export const mongo = MongoClient.connect(mongoUrl)

const indexes = [
  {
    collection: 'teams',
    index: { name: 1 },
    options: { unique: true }
  },
  {
    collection: 'teamMemberships',
    index: { teamId: 1, playerId: 1 },
    options: { unique: true }
  },
]

export const ensureIndexes = () => {
  return mongo.then(db => Promise.all(
    indexes.map(i => db.collection(i.collection).ensureIndex(i.index, i.options)))
  )
}

const collection = name => mongo
.then(db => db.collection(name))

// maps collection names to type names, to be used for database interaction
export const db = {
  Teams: () => collection('teams'),
  Players: () => collection('players'),
  TeamMemberships: () => collection('teamMemberships')
}
