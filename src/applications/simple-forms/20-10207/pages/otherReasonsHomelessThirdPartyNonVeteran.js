import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { OTHER_REASONS_3RD_PTY_NON_VET } from '../config/constants';

export default {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Are any of these other descriptions true for the claimant?',
      hint: 'If not, select continue.',
      required: false,
      labels: OTHER_REASONS_3RD_PTY_NON_VET,
      labelHeaderLevel: '3',
      tile: false,
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
