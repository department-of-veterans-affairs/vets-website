const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'table',
    fieldTable: getDrupalValue(entity.fieldTable),
  },
});
module.exports = {
  filter: ['field_table'],
  transform,
};
