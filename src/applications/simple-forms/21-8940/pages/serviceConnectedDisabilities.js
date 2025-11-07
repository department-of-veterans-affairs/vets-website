// @ts-check
import {
  titleUI,
  textareaSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Service-connected disabilities'),
    disabilitiesThatPreventWork: textareaUI({
      title: 'What service-connected disabilities prevent you from working?',
      charcount: true,
      errorMessages: {
        required:
          'Enter the service-connected disabilities that prevent you from working',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      disabilitiesThatPreventWork: {
        ...textareaSchema,
        maxLength: 400,
      },
    },
    required: ['disabilitiesThatPreventWork'],
  },
};
