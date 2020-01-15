/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    path: { $ref: 'GenericNestedString' },
    field_address: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: { $ref: 'GenericNestedString' },
    field_pdf_version: { $ref: 'GenericNestedString' },
    field_press_release_contact: { $ref: 'GenericNestedString' },
    field_press_release_downloads: { $ref: 'GenericNestedString' },
    field_press_release_fulltext: { $ref: 'GenericNestedString' },
    field_release_date: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'path',
    'field_address',
    'field_intro_text',
    'field_office',
    'field_pdf_version',
    'field_press_release_contact',
    'field_press_release_downloads',
    'field_press_release_fulltext',
    'field_release_date',
  ],
};
