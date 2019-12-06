// const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => {
  const { fieldSteps } = entity;
  return {
    entity: {
      entityBundle: 'process',
      fieldSteps: fieldSteps.map(item => ({ processed: item.value.trim() })),
    },
  };
};

module.exports = {
  filter: ['field_steps'],
  transform,
};
