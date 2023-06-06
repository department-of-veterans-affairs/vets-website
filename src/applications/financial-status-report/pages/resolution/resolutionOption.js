import ResolutionOptions from '../../components/ResolutionOptions';
import CustomResolutionOptionReview from '../../components/CustomResolutionOptionReview';
import {
  CurrentDebtTitle,
  CurrentDebtDescription,
} from '../../components/CurrentDebtTitle';
import { validateResolutionOption } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': CurrentDebtDescription,
      'ui:validations': [validateResolutionOption],
      resolutionOption: {
        'ui:title': ' ',
        'ui:reviewField': CustomResolutionOptionReview,
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
        properties: {
          resolutionOption: {
            type: 'string',
          },
        },
      },
    },
  },
};
