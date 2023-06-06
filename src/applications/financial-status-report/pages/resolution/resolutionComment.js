import {
  CurrentDebtTitle,
  CurrentDebtDescription,
} from '../../components/CurrentDebtTitle';
import ResolutionAmount from '../../components/ResolutionAmount';
import CustomResolutionReview from '../../components/CustomResolutionReview';
import { validateResolutionAmount } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': CurrentDebtDescription,
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
