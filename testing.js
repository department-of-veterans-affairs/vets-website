const fs = require('fs-extra');
const _ = require('lodash');

const legacy = fs.readJSONSync('legacy-pages.json');
const newb = fs.readJSONSync('new-pages.json');

const oldEntities = legacy.data.nodeQuery.entities;
const newEntities = newb.data.nodeQuery.entities;

const diff = oldEntities.filter(old => {

  if (JSON.stringify(old) === '{}') {
    console.log('empty object, who knows')
    return false;
  }

  const newbie = newEntities.find(n => n.entityBundle === old.entityBundle && n.entityId === old.entityId);

  if (newbie) {
    console.log('a newbie was found')
    return !_.isEqual(old, newbie)
  }

  return old;
})

console.log(diff)

const otherDiff = newEntities.filter(newbie => {
  const oldie = oldEntities.find(n => n.entityBundle === newbie.entityBundle && n.entityId === newbie.entityId);

  if (oldie) {
    console.log('a oldie was found')
    return !_.isEqual(oldie, newbie)
  }

  return newbie;
})

console.log(otherDiff)

console.log(oldEntities.filter(old => JSON.stringify(old) !== '{}').length)
console.log(newEntities.length)

console.log(Object.keys(legacy.data))
console.log(Object.keys(newb.data))

console.log(_.difference(Object.keys(legacy.data), Object.keys(newb.data)))
