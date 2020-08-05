const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'office',
    entityLabel: getDrupalValue(entity.title),
  },
});
module.exports = {
  filter: ['title'],
  transform,
};
