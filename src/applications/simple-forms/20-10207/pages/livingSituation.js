import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LIVING_SITUATIONS } from '../config/constants';

export default {
  uiSchema: {
    livingSituation: checkboxGroupUI({
      title: 'Which of these statements best describe your living situation?',
      required: true,
      labels: LIVING_SITUATIONS,
      labelHeaderLevel: '3',
      tile: false,
      errorMessages: {
        required: 'Select the appropriate living situations',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      livingSituation: checkboxGroupSchema(Object.keys(LIVING_SITUATIONS)),
    },
  },
};
