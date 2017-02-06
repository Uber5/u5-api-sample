import { db } from '../db'
import { externalizeIdOf } from 'u5-api-base/dist/mongo'
import log from 'u5-api-base/dist/log'

const memberships = team => db.TeamMemberships()
  .then(collection => collection.find({
    teamId: team.id,
    archived: { $ne: true }
  }))
  .then(result => result.toArray())
  .then(a => a.map(externalizeIdOf))

export default {
  memberships(team, _, context) {
    log('Team, memberships', team)
    return memberships(team)
  },
  members(team, _, context) {
    log('Team, members', team)
    return memberships(team)
    .then(memberships => memberships.map(mship => mship.playerId))
    .then(playerIds => Promise.all([ playerIds, db.Players() ]))
    .then(([ playerIds, collection ]) => collection.find({
      _id: { $in: playerIds },
      archived: { $ne: true }
    }))
    .then(result => result.toArray())
    .then(teams => teams.map(externalizeIdOf))
  }
}
