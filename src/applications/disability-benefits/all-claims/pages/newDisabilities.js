export const uiSchema = {
  'view:newDisabilities': {
    'ui:title':
      'Do you have any new service-connected disabilities or conditions to add to your claim?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['view:newDisabilities'],
  properties: {
    'view:newDisabilities': {
      type: 'boolean',
    },
  },
};
