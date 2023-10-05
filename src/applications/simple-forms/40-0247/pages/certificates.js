import {
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { textInputNumericRange } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('How many certificates should we send to your address?'),
    certificates: numberUI({
      title: 'Number of certificates',
      hint: 'You may request up to 99 certificates',
      inputmode: 'numeric',
      errorMessages: {
        required:
          'Please provide the number of certificates you’d like to request',
        pattern: 'Please enter a valid number between 1 and 99',
      },
      width: undefined,
    }),
    'ui:validations': [
      (errors, formData) => {
        return textInputNumericRange(errors, formData, {
          schemaKey: 'certificates',
          range: { min: 1, max: 99 },
          customErrorMessages: {
            min: 'Please enter a number between 1 and 99',
            max: 'Please enter a number between 1 and 99',
          },
        });
      },
    ],
  },
  schema: {
    type: 'object',
    properties: {
      certificates: numberSchema,
    },
    required: ['certificates'],
  },
};
