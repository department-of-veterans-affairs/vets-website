const { combineItemsInIndexedObject, getDrupalValue } = require('./helpers');

const transform = entity => {
  const fieldTable = getDrupalValue(entity.fieldTable);
  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'table',
      fieldTable: {
        tableValue: combineItemsInIndexedObject(fieldTable)
          .map(arr => arr.join(' '))
          .join(' '),
        // This is to get the `format` & `caption` fields in
        ...entity.fieldTable[0],
        value: fieldTable,
      },
    },
  };
};
module.exports = {
  filter: ['field_table'],
  transform,
};
