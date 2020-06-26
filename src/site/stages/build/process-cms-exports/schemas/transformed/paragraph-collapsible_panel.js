const { paragraph } = require('../helpers');

const baseType = 'paragraph';
const subType = 'collapsible_panel';
module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        contentModelType: { type: 'string', enum: [`${baseType}-${subType}`] },
        entityType: { type: 'string', enum: [baseType] },
        entityBundle: { type: 'string', enum: [subType] },
        fieldCollapsiblePanelBordered: { type: 'boolean' },
        fieldCollapsiblePanelExpand: { type: 'boolean' },
        fieldCollapsiblePanelMulti: { type: 'boolean' },
        fieldVaParagraphs: {
          type: 'array',
          items: paragraph(),
        },
      },
      required: [
        'entityBundle',
        'fieldCollapsiblePanelBordered',
        'fieldCollapsiblePanelExpand',
        'fieldCollapsiblePanelMulti',
        'fieldVaParagraphs',
      ],
    },
  },
  required: ['contentModelType', 'entity'],
};
