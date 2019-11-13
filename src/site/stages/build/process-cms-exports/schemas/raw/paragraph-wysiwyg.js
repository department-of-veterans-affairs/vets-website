const { getFilter } = require('../../filters');

/* eslint-disable camelcase */
module.exports = {
  type: 'object',
  properties: {
    field_wysiwyg: {
      $ref: 'GenericNestedString',
    },
  },
  required: getFilter('paragraph-wysiwyg'),
};
