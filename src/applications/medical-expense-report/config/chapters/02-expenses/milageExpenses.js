import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Milage expenses',
  path: 'expenses/milage',
  uiSchema: {
    ...titleUI('Milage expenses'),
    hasMileage: yesNoUI({
      title:
        'Did you, your spouse, or your dependents pay mileage that wasn’t reimbursed?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['hasMileage'],
    properties: {
      hasMileage: {
        type: 'boolean',
      },
    },
  },
};
