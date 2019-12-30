const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'office',
    title: getDrupalValue(entity.title),
  },
});
module.exports = {
  filter: ['title'],
  transform,
};
