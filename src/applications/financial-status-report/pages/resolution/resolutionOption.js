import ResolutionOptions from '../../components/ResolutionOptions';
import {
  CurrentDebtTitle,
  CurrentDebtDescription,
} from '../../components/CurrentDebtTitle';
import {
  validateResolutionOption,
  validateWaiverCheckbox,
} from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': CurrentDebtDescription,
      'ui:validations': [validateResolutionOption, validateWaiverCheckbox],
      'ui:options': {
        hideOnReview: true,
      },
      resolutionOption: {
        'ui:title': ' ',
        'ui:widget': ResolutionOptions,
        'ui:options': {
          customTitle: ' ',
          keepInPageOnReview: true,
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
