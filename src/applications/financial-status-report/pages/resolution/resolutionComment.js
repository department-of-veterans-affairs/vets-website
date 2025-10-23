import { CurrentDebtTitle } from '../../components/shared/CurrentDebtTitle';
import ResolutionAmount from '../../components/resolution/ResolutionAmount';
import { validateResolutionAmount } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:validations': [validateResolutionAmount],
      resolutionComment: {
        'ui:title': ' ',
        'ui:widget': ResolutionAmount,
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
          resolutionComment: {
            type: 'string',
          },
        },
      },
    },
  },
};
