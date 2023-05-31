// for Flow 1: self claim, vet claimant
/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Provide your supporting statement',
    statement: {
      'ui:title':
        'Tell us what you think we need to know about the facts or circumstances relevant to your claim. Include any information that we don’t already have and that you think may support your claim.',
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
