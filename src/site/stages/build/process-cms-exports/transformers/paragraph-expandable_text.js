const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => {
  const { fieldWysiwyg, fieldTextExpander } = entity;
  return {
    entity: {
      fieldWysiwyg: { processed: getDrupalValue(fieldWysiwyg) },
      fieldTextExpander: getWysiwygString(getDrupalValue(fieldTextExpander)),
    },
  };
};

module.exports = transform;
