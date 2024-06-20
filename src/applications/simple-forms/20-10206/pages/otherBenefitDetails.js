import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
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
      'ui:webComponentField': VaTextareaField,
      'ui:errorMessages': {
        required: 'Describe the benefit records you’d like to request',
      },
      'ui:options': {
        charcount: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherBenefitDetails: {
        type: 'string',
        maxLength: 75,
      },
    },
    required: ['otherBenefitDetails'],
  },
};
