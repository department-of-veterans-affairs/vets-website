import ResolutionOptions from '../../components/ResolutionOptions';
import CurrentDebtTitle from '../../components/CurrentDebtTitle';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
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
