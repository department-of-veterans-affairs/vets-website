import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Expense Types',
  path: 'expenses/types',
  uiSchema: {
    ...titleUI('Expenses'),
    expenseTypes: checkboxGroupUI({
      title: 'Select which types of expenses you would like to report',
      required: true,
      labels: {
        hasCareExpenses: 'In-home care and facility',
        hasMedicalExpenses: 'Other medical expenses',
        hasMileage: 'Mileage',
      },
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      expenseTypes: checkboxGroupSchema([
        'hasCareExpenses',
        'hasMedicalExpenses',
        'hasMileage',
      ]),
    },
  },
};
