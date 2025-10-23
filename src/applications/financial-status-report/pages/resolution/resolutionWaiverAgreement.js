import { CurrentDebtTitle } from '../../components/shared/CurrentDebtTitle';
import ResolutionWaiverAgreement from '../../components/resolution/ResolutionWaiverAgreement';
import { validateWaiverCheckbox } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:validations': [validateWaiverCheckbox],
      resolutionWaiverCheck: {
        'ui:title': ' ',
        'ui:widget': ResolutionWaiverAgreement,
        'ui:required': () => false,
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
        required: ['resolutionWaiverCheck'],
        properties: {
          resolutionWaiverCheck: {
            type: 'boolean',
          },
        },
      },
    },
  },
};
