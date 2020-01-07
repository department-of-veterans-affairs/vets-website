const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'document',
    fieldDocument: {
      entity: {
        filename: getDrupalValue(entity.name),
        url: entity.path[0].alias,
      },
    },
  },
});
module.exports = {
  filter: ['name', 'path'],
  transform,
};
