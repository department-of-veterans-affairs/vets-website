import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Additional records information'),
    additionalRecordsInformation: {
      'ui:title':
        'Do you have more details that could help us locate your records? (optional)',
      'ui:webComponentField': VaTextareaField,
      'ui:options': {
        charcount: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalRecordsInformation: {
        type: 'string',
        maxLength: 335,
      },
    },
  },
};
