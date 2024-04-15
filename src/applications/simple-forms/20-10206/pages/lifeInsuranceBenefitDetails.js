import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Life insurance benefit details',
      'You requested access to your life insurance benefit records. Any extra information you can share will help us find your records.',
    ),
    lifeInsuranceBenefitDetails: {
      'ui:title': 'Life insurance policy number (optional)',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:options': {
        charcount: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      lifeInsuranceBenefitDetails: {
        type: 'string',
        maxLength: 25,
      },
    },
  },
};
