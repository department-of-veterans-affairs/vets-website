import {
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Last illness and burial expenses'),
    'ui:description':
      "Enter the total amount of expenses you paid for the deceased's last illness and burial.",
    lastIllnessExpenses: numberUI('Last illness expenses'),
    burialExpenses: numberUI('Burial expenses'),
    totalExpenses: {
      ...numberUI('Total expenses'),
      'ui:disabled': true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      lastIllnessExpenses: numberSchema,
      burialExpenses: numberSchema,
      totalExpenses: numberSchema,
    },
  },
};
