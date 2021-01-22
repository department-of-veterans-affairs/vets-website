const { getWysiwygString } = require('./helpers');

const transform = entity => {
  const { fieldSteps } = entity;
  return {
    entity: {
      entityBundle: 'process',
      fieldSteps: fieldSteps.map(item => ({
        processed: getWysiwygString(item.processed),
      })),
    },
  };
};

module.exports = {
  filter: ['field_steps'],
  transform,
};
