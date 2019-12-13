const { getDrupalValue } = require('./helpers');

const combineItemsInIndexedObject = obj => {
  const values = [];
  for (const [key, value] of Object.entries(obj)) {
    if (Number.isInteger(Number.parseInt(key, 10))) {
      values.push(value);
    }
  }

  return values;
};

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
