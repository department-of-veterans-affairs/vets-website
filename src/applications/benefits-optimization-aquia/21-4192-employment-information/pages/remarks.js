/**
 * @module config/form/pages/remarks
 * @description Standard form system configuration for Remarks page
 * VA Form 21-4192 - Request for Employment Information
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Remarks page
 * Collects additional remarks or comments about the veteran's employment
 */
export const remarksUiSchema = {
  'ui:title': 'Additional remarks',
  // 'ui:description': getPageDescription,
  remarks: {
    remarks: textareaUI({
      title: ' ',
      hint:
        'You can provide any additional information that may be helpful in processing this claim.',
      charcount: true,
      errorMessages: {
        maxLength: 'Remarks must be less than 2000 characters',
      },
    }),
  },
};

/**
 * JSON Schema for Remarks page
 * Validates the remarks field
 */
export const remarksSchema = {
  type: 'object',
  properties: {
    remarks: {
      type: 'object',
      properties: {
        remarks: {
          type: 'string',
          maxLength: 2000,
        },
      },
    },
  },
};
