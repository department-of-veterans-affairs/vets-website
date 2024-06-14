export function uiSchema(title) {
  return {
    application: {
      veteran: {
        'view:hasServiceName': {
          'ui:title': title,
          'ui:widget': 'yesNo',
        },
      },
    },
  };
}
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          required: ['view:hasServiceName'],
          properties: {
            'view:hasServiceName': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
