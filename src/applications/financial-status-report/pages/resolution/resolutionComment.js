import ResolutionCompromiseAgreement from '../../components/ResolutionCompromiseAgreement';
import {
  CurrentDebtTitle,
  CurrentDebtDescription,
} from '../../components/CurrentDebtTitle';
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
        // 'ui:options': {
        //   classNames: 'schemaform-currency-input',
        //   widgetClassNames: 'input-size-3',
        // },
        'ui:field': ResolutionCompromiseAgreement,
        // triggers validation when the field is not required
        // 'ui:required': () => {},
        // 'ui:validations': [validateCurrency],
        // 'ui:required': (formData, index) => {
        //   return (
        //     formData.selectedDebtsAndCopays[index]?.resolutionOption &&
        //     formData.selectedDebtsAndCopays[index]?.resolutionOption !==
        //       'waiver'
        //   );
        // },
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
