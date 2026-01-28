// @ts-check
import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Medical School Information',
      'Enter the name of the accrediting authority operating in your country that recognizes the institution as a medical school.',
    ),
    accreditingAuthorityName: {
      ...textUI({
        title: 'Accrediting authority name',
        errorMessages: {
          required: 'Enter the name of the accrediting authority.',
        },
        validations: [validateWhiteSpace],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      accreditingAuthorityName: { ...textSchema, maxLength: 100 },
    },
    required: ['accreditingAuthorityName'],
  },
};
