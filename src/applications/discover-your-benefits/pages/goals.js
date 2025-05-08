import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { goalTypes, goalTypeLabels } from '../constants/benefits';

/** @type {PageSchema} */
export default {
  uiSchema: {
    goals: checkboxGroupUI({
      enableAnalytics: true,
      title: 'What goals do you want to accomplish?',
      hint: 'Check all that apply.',
      required: () => true,
      labels: goalTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      goals: checkboxGroupSchema(Object.keys(goalTypes)),
    },
  },
};
