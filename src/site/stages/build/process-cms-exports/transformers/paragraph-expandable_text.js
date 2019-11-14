const { getDrupalValue } = require('./helpers');

const transform = entity => {
  const { fieldWysiwyg, fieldTextExpander } = entity;
  return Object.assign({}, entity, {
    entity: {
      fieldWysiwyg: { processed: getDrupalValue(fieldWysiwyg) },
      fieldTextExpander: getDrupalValue(fieldTextExpander),
    },
  });
};

module.exports = transform;
