import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  militaryBranchTypes,
  militaryBranchTypeLabels,
} from '../constants/benefits';

/** @type {PageSchema} */
export default {
  uiSchema: {
    militaryBranch: checkboxGroupUI({
      enableAnalytics: true,
      title: 'What branch(es) of the military did you serve in?',
      hint: 'Check all that apply.',
      required: () => false,
      labels: militaryBranchTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      militaryBranch: checkboxGroupSchema(Object.keys(militaryBranchTypes)),
    },
  },
};
