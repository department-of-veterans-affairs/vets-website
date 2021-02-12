const fs = require('fs-extra');
const _ = require('lodash');

const legacy = fs.readJSONSync('legacy-pages.json');
const newb = fs.readJSONSync('new-pages.json');

const oldEntities = legacy.data.nodeQuery.entities;
const newEntities = newb.data.nodeQuery.entities;

const diff = oldEntities.filter(old => {

  if (JSON.stringify(old) === '{}') {
    console.log('Skipping empty object...')
    return false;
  }

  const newbie = newEntities.find(n => n.entityBundle === old.entityBundle && n.entityId === old.entityId);

  if (newbie) {
    return !_.isEqual(old, newbie)
  }

  return old;
})

console.log(diff)

const otherDiff = newEntities.filter(newbie => {
  const oldie = oldEntities.find(n => n.entityBundle === newbie.entityBundle && n.entityId === newbie.entityId);

  if (oldie) {
    return !_.isEqual(oldie, newbie)
  }

  return newbie;
})

console.log(otherDiff)

console.log(oldEntities.filter(old => JSON.stringify(old) !== '{}').length)
console.log(newEntities.length)

console.log(_.difference(Object.keys(legacy.data), Object.keys(newb.data)))

const same = _.isEqual(
  _.omit(legacy.data, 'nodeQuery'),
  _.omit(newb.data, 'nodeQuery'),
)

console.log(same)

console.log(
  _.isEqual(
    _.sortBy(oldEntities.filter(old => JSON.stringify(old) !== '{}'), 'entityId'),
    _.sortBy(newEntities, 'entityId'),
  )
)
