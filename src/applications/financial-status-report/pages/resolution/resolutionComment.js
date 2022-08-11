export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': 'SOME TITLE',
      resolutionComment: {
        'ui:title': 'Your reason why or whatever',
        'ui:widget': 'textarea',
        'ui:errorMessages': {
          required: 'idk do stuff',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        required: ['resolutionComment'],
        properties: {
          resolutionComment: {
            type: 'string',
          },
        },
      },
    },
  },
};
