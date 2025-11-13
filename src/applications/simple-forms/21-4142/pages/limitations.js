import {
  textareaSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { schemaFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Do you want to limit the information we can request?',
    }),
    [schemaFields.limitedConsent]: textareaUI({
      title:
        'If you want to limit what we can request from the private medical providers, describe the limits here. For example, you want your provider to release only treatment dates or certain types of disabilities. If you limit consent, it may take us longer to get the private medical records.',
      hint: '(Max. 100 characters)',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [schemaFields.limitedConsent]: { ...textareaSchema, maxLength: 100 },
    },
  },
};
