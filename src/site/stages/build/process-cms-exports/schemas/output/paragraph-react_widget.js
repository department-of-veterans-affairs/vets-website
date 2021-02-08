module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-react_widget'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['react_widget'] },
        fieldButtonFormat: { type: 'boolean' },
        fieldCtaWidget: { type: 'boolean' },
        fieldDefaultLink: {
          type: ['object', 'null'],
          properties: {
            url: {
              type: 'object',
              properties: { path: { type: 'string' } },
              required: ['path'],
            },
            title: { type: 'string' },
          },
          required: ['url', 'title'],
        },
        // It probably _should_ just be a string, but it isn't...
        // fieldErrorMessage: { type: 'string' },
        fieldErrorMessage: {
          type: ['object', 'null'],
          properties: {
            value: { type: 'string' },
          },
          required: ['value'],
        },
        fieldLoadingMessage: { type: ['string', 'null'] },
        fieldTimeout: { oneOf: [{ type: 'null' }, { type: 'number' }] },
        fieldWidgetType: { type: 'string' },
      },
      required: [
        'fieldButtonFormat',
        'fieldCtaWidget',
        'fieldDefaultLink',
        'fieldErrorMessage',
        'fieldLoadingMessage',
        'fieldTimeout',
        'fieldWidgetType',
      ],
    },
  },
  required: ['entity'],
};
