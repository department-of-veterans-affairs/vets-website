import VaTextAreaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Financial record details',
      'You requested access to your financial records. Any extra information you can share will help us find your records.',
    ),
    financialRecordDetails: {
      'ui:widget': 'textarea',
      'ui:title':
        'Describe the financial records you’d like to request (optional)',
      'ui:webComponentField': VaTextAreaField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      financialRecordDetails: {
        type: 'string',
      },
    },
  },
};
