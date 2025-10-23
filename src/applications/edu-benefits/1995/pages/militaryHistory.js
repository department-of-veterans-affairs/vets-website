export const uiSchema = {
  'view:hasServiceBefore1978': {
    'ui:title': 'Do you have any periods of service that began before 1978?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:hasServiceBefore1978': {
      type: 'boolean',
    },
  },
};
