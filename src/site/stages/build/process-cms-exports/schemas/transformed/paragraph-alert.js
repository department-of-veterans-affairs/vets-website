const baseType = 'paragraph';
const subType = 'alert';
module.exports = {
  type: 'object',
  properties: {
    contentModelType: { type: 'string', enum: [`${baseType}-${subType}`] },
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: [baseType] },
        entityBundle: { type: 'string', enum: [subType] },
        fieldAlertType: { type: 'string' },
        fieldAlertHeading: { type: 'string' },
        fieldVaParagraphs: {
          type: 'array',
          items: { $ref: 'Paragraph' },
        },
        fieldAlertBlockReference: {
          type: ['null', 'array'],
          items: {
            $ref: 'BlockContent',
          },
        },
      },
      required: [
        'entityType',
        'entityBundle',
        'fieldAlertType',
        'fieldAlertHeading',
        'fieldVaParagraphs',
        'fieldAlertBlockReference',
      ],
    },
  },
  required: ['contentModelType', 'entity'],
};
