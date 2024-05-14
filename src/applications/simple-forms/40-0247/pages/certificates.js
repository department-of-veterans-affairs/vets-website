import {
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('How many certificates should we send to your address?'),
    certificates: numberUI({
      title: 'Number of certificates',
      hint: 'You may request up to 99 certificates',
      errorMessages: {
        required: 'Enter the number of certificates you’d like to request',
        pattern: 'Enter a valid number between 1 and 99',
      },
      min: 1,
      max: 99,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      certificates: numberSchema,
    },
    required: ['certificates'],
  },
};
