import ResolutionOptions from '../../components/resolution/ResolutionOptions';
import { CurrentDebtTitle } from '../../components/shared/CurrentDebtTitle';
import { validateResolutionOption } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:validations': [validateResolutionOption],
      resolutionOption: {
        'ui:title': ' ',
        'ui:widget': ResolutionOptions,
        'ui:options': {
          hideOnReview: true,
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
        properties: {
          resolutionOption: {
            type: 'string',
          },
        },
      },
    },
  },
};
