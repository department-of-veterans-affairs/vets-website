import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { goalTypes, goalTypeLabels } from '../constants/benefits';

/** @type {PageSchema} */
export default {
  uiSchema: {
    goals: checkboxGroupUI({
      title: 'What goal(s) do you want to accomplish?',
      hint: 'You may only select this for one employer address.',
      required: false,
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
