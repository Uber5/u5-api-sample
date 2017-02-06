import { db } from '../db'
import { externalizeIdOf } from 'u5-api-base/dist/mongo'
import log from 'u5-api-base/dist/log'

const teamMembershipsOf = player => {
  return db.TeamMemberships()
  .then(collection => collection.find({
    playerId: player.id,
    archived: { $ne: true }
  }))
  .then(result => result.toArray())
  .then(a => a.map(externalizeIdOf))
}

export default {
  archived(player) {
    return player.archived || false
  },
  teamMemberships(player, _, context) {
    log('teamMemberships', player)
    return teamMembershipsOf(player)
  },
  teams(player, _, context) {
    log('teams', player)
    return teamMembershipsOf(player)
    .then(mships => mships.map(mship => mship.teamId))
    .then(teamIds => Promise.all([ teamIds, db.Teams() ]))
    .then(([ teamIds, teamsCollection ]) => teamsCollection.find({ _id: { $in: teamIds }}))
    .then(result => result.toArray())
    .then(teams => teams.map(externalizeIdOf))
  }
}
