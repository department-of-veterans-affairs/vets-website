import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const uiSchema = {
  ...titleUI('Your Veteran status'),
  veteranStatus: radioUI({
    title:
      'Are you a Veteran who has completed 3 years (36 months) of active duty?',
    labels: {
      yes: 'Yes',
      no: 'No',
    },
    errorMessages: {
      required: 'Select one option',
    },
  }),
};
const schema = {
  type: 'object',
  properties: {
    veteranStatus: radioSchema(['yes', 'no']),
  },
  required: ['veteranStatus'],
};

export { uiSchema, schema };
