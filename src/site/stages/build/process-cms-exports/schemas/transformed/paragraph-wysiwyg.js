const { getFilter } = require('../../filters');

module.exports = {
  type: 'object',
  properties: {
    fieldWysiwyg: {
      type: 'object',
      properties: {
        processed: {
          type: 'string',
        },
      },
    },
  },
  required: getFilter('paragraph-wysiwyg'),
};
