import VaTextAreaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Other compensation and pension record details',
      'You requested access to another type of record that wasn’t listed. Any extra information you can share will help us find your records.',
    ),
    otherCompAndPenDetails: {
      'ui:widget': 'textarea',
      'ui:title':
        'Describe the compensation and pension records you’d like to request',
      'ui:webComponentField': VaTextAreaField,
      'ui:errorMessages': {
        required:
          'Please describe the compensation and pension records you’re requesting',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherCompAndPenDetails: {
        type: 'string',
      },
    },
    required: ['otherCompAndPenDetails'],
  },
};
