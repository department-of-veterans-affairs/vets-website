const { getDrupalValue } = require('./helpers');

const transform = entity => {
  const { fieldWysiwyg, fieldTextExpander } = entity;
  return {
    entity: {
      fieldWysiwyg: { processed: getDrupalValue(fieldWysiwyg) },
      fieldTextExpander: getDrupalValue(fieldTextExpander),
    },
  };
};

module.exports = transform;
