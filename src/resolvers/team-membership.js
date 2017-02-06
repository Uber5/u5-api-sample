import { db } from '../db'
import { externalizeIdOf } from '../../src/mongo'
import log from '../../src/log'

export default {
  team(mship, _, context) {
    log('teamMembership.team', mship)
    return db.Teams()
    .then(collection => collection.findOne({ _id: mship.teamId }))
    .then(externalizeIdOf)
  },
  player(mship, _, context) {
    log('TeamMembership, player', mship)
    return db.Players()
    .then(collection => collection.findOne({ _id: mship.playerId }))
    .then(externalizeIdOf)
  }
}
