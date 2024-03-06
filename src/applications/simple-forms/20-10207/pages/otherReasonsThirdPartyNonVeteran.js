import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { OTHER_REASONS_3RD_PTY_NON_VET } from '../config/constants';

export default {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Which of these descriptions is true for the Claimant?',
      hint: 'Select all that apply.',
      required: true,
      labels: OTHER_REASONS_3RD_PTY_NON_VET,
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
      otherReasons: checkboxGroupSchema(
        Object.keys(OTHER_REASONS_3RD_PTY_NON_VET),
      ),
    },
  },
};
