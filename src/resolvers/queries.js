import { db } from '../db'
import { externalizeIdOf, internalize } from 'u5-api-base/dist/mongo'
import { failIfNotFound } from 'u5-api-base/dist/utils'
import log from 'u5-api-base/dist/log'

export default {

  team(_, { id }, context) {
    log('fetching team', id)
    return db.Teams()
    .then(teams => teams.findOne({ _id: internalize(id) }))
    .then(failIfNotFound(`Team with id ${ id }`))
    .then(externalizeIdOf)
  },

  teams() {
    log('fetching all teams')
    return db.Teams()
    .then(collection => collection.find().toArray())
    .then(a => a.map(externalizeIdOf))
  },

  player(_, { id }, context) {
    log('fetching player', id)
    return db.Players()
    .then(collection => collection.findOne({ _id: internalize(id) }))
    .then(failIfNotFound(`Player with id ${ id }`))
    .then(externalizeIdOf)
  },

  players(_, { teamId }, context) {
    log('fetching all players')
    return db.Players()
    .then(p => p.find({ archived: { $ne: true } }).toArray())
    .then(a => a.map(externalizeIdOf))
  }

}
