module.exports = {
  type: 'object',
  required: ['fieldAlert', 'fieldMedia', 'fieldWysiwyg'],
  properties: {
    entity: {
      fieldAlert: { $ref: 'output/paragraph-alert_single' },
      fieldMedia: {
        type: ['object', 'null'],
        properties: {
          entity: { $ref: 'output/media-image' },
        },
      },
      fieldWysiwyg: { $ref: 'output/paragraph-wysiwyg' },
    },
  },
};
