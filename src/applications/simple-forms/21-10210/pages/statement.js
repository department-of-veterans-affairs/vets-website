export default {
  uiSchema: {
    'ui:title': 'Please indicate the claimed issue that you are addressing',
    statement: {
      'ui:title':
        'Describe what you yourself know or have observed about the facts or circumstances relevant to this claim before VA',
      'ui:widget': 'textarea',
      'ui:autocomplete': 'off',
    },
  },
  schema: {
    type: 'object',
    required: ['statement'],
    properties: {
      statement: {
        type: 'string',
      },
    },
  },
};
