import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { MedicalExpenseDescription } from './helpers';

const { hasMedicalExpenses } = fullSchemaPensions.properties;
import { showMultiplePageResponse } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Medical expenses and other unreimbursed expenses',
  path: 'financial/medical-expenses',
  depends: () => !showMultiplePageResponse(),
  uiSchema: {
    ...titleUI(
      'Medical expenses and other unreimbursed expenses',
      MedicalExpenseDescription,
    ),
    hasMedicalExpenses: yesNoUI({
      title:
        "Do you, your spouse, or your dependents pay medical or other expenses that aren't reimbursed?",
    }),
  },
  schema: {
    type: 'object',
    required: ['hasMedicalExpenses'],
    properties: {
      hasMedicalExpenses,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
