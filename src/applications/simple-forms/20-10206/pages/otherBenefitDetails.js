import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Other benefit record details',
      'You requested access to another type of record that wasn’t listed. Any extra information you can share will help us find your records.',
    ),
    otherBenefitDetails: {
      'ui:title': 'Describe the benefit records you’d like to request',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Describe the benefit records you’d like to request',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherBenefitDetails: {
        type: 'string',
      },
    },
    required: ['otherBenefitDetails'],
  },
};
