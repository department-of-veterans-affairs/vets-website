// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'step',
    fieldAlert: entity.fieldAlert[0],
    fieldMedia: entity.fieldMedia[0],
    fieldWysiwyg: entity.fieldWysiwyg[0],
  },
});

module.exports = {
  filter: ['field_alert', 'field_media', 'field_wysiwyg'],
  transform,
};
