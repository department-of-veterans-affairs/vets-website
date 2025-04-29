import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { OTHER_REASONS_3RD_PTY_VET } from '../config/constants';

export default {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Are any of these other descriptions true for the Veteran?',
      hint:
        'If yes, select which descriptions are true. If no, select continue.',
      required: false,
      labels: OTHER_REASONS_3RD_PTY_VET,
      labelHeaderLevel: '3',
      tile: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherReasons: checkboxGroupSchema(Object.keys(OTHER_REASONS_3RD_PTY_VET)),
    },
  },
};
