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

  console.log('a newbie was found')

  return !_.isEqual(old, newbie)
})

console.log(diff)
