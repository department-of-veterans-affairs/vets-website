const { combineItemsInIndexedObject, getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'table',
    fieldTable: {
      tableValue: []
        .concat(
          ...combineItemsInIndexedObject(getDrupalValue(entity.fieldTable)),
        )
        .join(' '),
      // This is to get the `format` & `caption` fields in
      ...entity.fieldTable[0],
      value: getDrupalValue(entity.fieldTable),
    },
  },
});
module.exports = {
  filter: ['field_table'],
  transform,
};
