/* eslint-disable camelcase */
const { getFilter } = require('../../filters');
const nodeStandardKeys = require('../standard-keys/node');

module.exports = {
  type: 'object',
  properties: {
    // Standard `node` key-value pairs.
    ...nodeStandardKeys,
    // `outreach-asset`-specific key-value pairs.
    field_administration: {
      $ref: 'EntityReference',
    },
    field_benefits: {
      $ref: 'GenericNestedString',
    },
    field_description: {
      $ref: 'GenericNestedString',
    },
    field_format: {
      $ref: 'GenericNestedString',
    },
    field_intro_text: {
      $ref: 'GenericNestedString',
    },
    field_media: {
      $ref: 'EntityReference',
    },
    field_meta_tags: {
      $ref: 'GenericNestedString',
    },
    field_meta_title: {
      $ref: 'GenericNestedString',
    },
    field_office: {
      $ref: 'EntityReference',
    },
  },
  required: getFilter('node-outreach-asset'),
};
