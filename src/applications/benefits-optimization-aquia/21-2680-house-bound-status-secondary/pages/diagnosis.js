/**
 *
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

export const diagnosisUiSchema = {
  'ui:title': 'Diagnosis',
  diagnosis: textareaUI({
    title:
      'Provide a complete diagnosis with the most significant symptoms for each condition.',
    hint:
      'The diagnosis needs to equate to the level of assistance described in the rest of the form.',
    charcount: true,
    maxlength: 1000,
    errorMessages: {
      required: 'Diagnosis information is required',
      maxLength: 'Diagnosis must be 1000 characters or less',
    },
  }),
};

export const diagnosisSchema = {
  type: 'object',
  required: ['diagnosis'],
  properties: {
    diagnosis: { type: 'string', maxLength: 1000 },
  },
};
