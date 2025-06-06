import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { OTHER_REASONS_3RD_PTY_VET } from '../config/constants';

export default {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Which of these descriptions are true for the Veteran?',
      hint: 'Select all that apply',
      required: true,
      labels: OTHER_REASONS_3RD_PTY_VET,
      labelHeaderLevel: '3',
      tile: false,
      errorMessages: {
        required: 'Select at least one description',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherReasons: checkboxGroupSchema(Object.keys(OTHER_REASONS_3RD_PTY_VET)),
    },
    required: ['otherReasons'],
  },
};
