const { getDrupalValue } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg, contentModelType } = entity;

  const transformed = {
    contentModelType,
    entity: {
      entityType: 'paragraph',
      entityBundle: 'wysiwyg',

      fieldWysiwyg: {
        processed: getDrupalValue(fieldWysiwyg).replace(/(\r\n|\t)/gm, ''),
      },
    },
  };

  return transformed;
}

module.exports = wysiwygTransform;
