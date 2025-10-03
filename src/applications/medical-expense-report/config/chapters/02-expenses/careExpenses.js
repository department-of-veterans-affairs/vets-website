import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CareExpenseDescription } from '../../../components/MedicalExpenseDescriptions';

/** @type {PageSchema} */
export default {
  title: 'Care expenses',
  path: 'expenses/care',
  uiSchema: {
    ...titleUI('Care expenses'),
    'ui:description': CareExpenseDescription,
    hasCareExpenses: yesNoUI({
      title:
        'Do you, your spouse, or your dependents pay recurring care expenses that aren’t reimbursed',
      // classNames: 'vads-u-margin-bottom--2',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
    // expenseTypes: checkboxGroupUI({
    //   title: 'Select which types of expenses you would like to report',
    //   required: true,
    //   labels: {
    //     hasCareExpenses: 'In-home care and facility',
    //     hasMedicalExpenses: 'Other medical expenses',
    //     hasMileage: 'Mileage',
    //   },
    // }),
  },
  schema: {
    type: 'object',
    required: ['hasCareExpenses'],
    properties: {
      hasCareExpenses: {
        type: 'boolean',
      },
      // expenseTypes: checkboxGroupSchema([
      //   'hasCareExpenses',
      //   'hasMedicalExpenses',
      //   'hasMileage',
      // ]),
    },
  },
};
