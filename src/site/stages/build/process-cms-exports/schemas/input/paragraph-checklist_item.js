/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: ['field_checklist_items', 'field_section_header'],
  properties: {
    field_checklist_items: { type: 'array', items: { type: 'string' } },
    field_section_header: { type: 'string' },
  },
};
