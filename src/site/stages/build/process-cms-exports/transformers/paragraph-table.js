function tableTransform(entity) {
  const { fieldTable } = entity;

  const smash = [];
  for (const [key, value] of Object.entries(fieldTable[0].value)) {
    if (Number.isInteger(Number.parseInt(key, 10))) {
      smash.push(value);
    }
  }

  return {
    entity: {
      entityBundle: 'table',

      fieldTable: {
        tableValue: [].concat(...smash).join(' '),
        ...fieldTable[0],
        value: fieldTable[0].value,
      },
    },
  };
  // ];
}

module.exports = {
  filter: ['field_table'],
  transform: tableTransform,
};
