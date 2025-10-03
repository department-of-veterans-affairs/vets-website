import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedicalExpenseDescription } from '../../../components/MedicalExpenseDescriptions';

/** @type {PageSchema} */
export default {
  title: 'Medical expenses',
  path: 'expenses/medical',
  uiSchema: {
    ...titleUI('Medical expenses'),
    'ui:description': MedicalExpenseDescription,
    hasMedicalExpenses: yesNoUI({
      title:
        'Do you, your spouse, or your dependents pay medical or other expenses that aren’t reimbursed?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['hasMedicalExpenses'],
    properties: {
      hasMedicalExpenses: {
        type: 'boolean',
      },
    },
  },
};
