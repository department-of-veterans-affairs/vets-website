const { getDrupalValue } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg } = entity;

  const transformed = Object.assign(
    {},
    {
      entityType: 'paragraph',
      entityBundle: 'wysiwyg',

      fieldWysiwyg: {
        processed: getDrupalValue(fieldWysiwyg).replace(/(\r\n|\t)/gm, ''),
      },
    },
  );

  return transformed;
}

module.exports = wysiwygTransform;
