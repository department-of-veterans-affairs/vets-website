import ResolutionOptions from '../../components/ResolutionOptions';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': ' ',
      resolutionOptions: {
        'ui:widget': ResolutionOptions,
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
        required: ['resolutionOptions'],
        properties: {
          resolutionOptions: {
            type: 'string',
          },
        },
      },
    },
  },
};
