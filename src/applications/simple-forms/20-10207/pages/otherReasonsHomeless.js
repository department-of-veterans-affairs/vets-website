import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { OTHER_REASONS } from '../config/constants';

export default {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Are any of these other descriptions true for you?',
      hint: 'If not, select Continue.',
      required: false,
      labels: OTHER_REASONS,
      labelHeaderLevel: '3',
      tile: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherReasons: checkboxGroupSchema(Object.keys(OTHER_REASONS)),
    },
  },
};
