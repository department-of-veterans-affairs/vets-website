import { CurrentDebtTitle } from '../../components/shared/CurrentDebtTitle';
import ResolutionAmount from '../../components/resolution/ResolutionAmount';
import CustomResolutionReview from '../../components/shared/CustomResolutionReview';
import { validateResolutionAmount } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:validations': [validateResolutionAmount],
      resolutionComment: {
        'ui:title': ' ',
        'ui:reviewField': CustomResolutionReview,
        'ui:widget': ResolutionAmount,
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
