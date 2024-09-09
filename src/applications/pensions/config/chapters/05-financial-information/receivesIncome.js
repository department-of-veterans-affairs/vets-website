import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { receivesIncome } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Receives income',
  path: 'financial/receives-income',
  uiSchema: {
    ...titleUI('Gross monthly income'),
    receivesIncome: yesNoUI({
      title: 'Do you, your spouse, or your dependents receive income?',
      hint:
        'Your income is how much you earn. It includes your Social Security benefits, investment and retirement payments, and any income your spouse and dependents receive.',
    }),
  },
  schema: {
    type: 'object',
    required: ['receivesIncome'],
    properties: {
      receivesIncome,
    },
  },
};
