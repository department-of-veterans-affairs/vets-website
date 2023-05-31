// for Flow 4: 3rd-party claim, not-vet claimant
/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Tell us about the claimed issue that you’re addressing',
    statement: {
      'ui:title':
        'Describe what you know or have observed about the facts or circumstances relevant to this claim before VA.',
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
