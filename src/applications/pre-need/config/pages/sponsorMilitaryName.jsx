import environment from 'platform/utilities/environment';

export const uiSchema = {
  application: {
    veteran: {
      'view:hasServiceName': {
        'ui:title': environment.isProduction()
          ? 'Did your sponsor serve under another name?'
          : 'Did the sponsor serve under another name?',
        'ui:widget': 'yesNo',
      },
    },
  },
};
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
