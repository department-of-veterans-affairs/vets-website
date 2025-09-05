import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const uiSchema = {
  ...titleUI('Your Veteran status'),
  atLeast3Years: radioUI({
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
    atLeast3Years: radioSchema(['yes', 'no']),
  },
  required: ['atLeast3Years'],
};

export { uiSchema, schema };
