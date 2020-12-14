/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: ['field_checklist_sections'],
  properties: {
    field_checklist_sections: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
  },
};
