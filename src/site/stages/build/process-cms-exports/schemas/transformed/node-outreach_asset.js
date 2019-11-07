/* eslint-disable camelcase */
module.exports = {
  $id: 'node-outreach_asset',
  type: 'object',
  properties: {
    // Standard `node` key-value pairs.
    changed: {
      type: 'number',
    },
    // Unsure how this key-value pair is derived from the CMS export data.
    // entityID: {
    //   type: 'string',
    // },
    status: {
      type: 'boolean',
    },
    title: {
      type: 'string',
    },
    // `outreach_asset`-specific key-value pairs.
    fieldBenefits: {
      $ref: 'nullable-string',
    },
    fieldDescription: {
      $ref: 'nullable-string',
    },
    fieldFormat: {
      type: 'string',
    },
    fieldOffice: {
      type: 'object',
      properties: {
        targetID: {
          value: 'number',
        },
      },
    },
  },
};
