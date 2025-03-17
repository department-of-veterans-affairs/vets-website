import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import capitalize from 'lodash/capitalize';

import { CONDITION_BY_CONDITION, CONDITIONS_FIRST } from '../constants';

const demoOptions = {
  CONDITION_BY_CONDITION: capitalize(CONDITION_BY_CONDITION),
  CONDITIONS_FIRST: capitalize(CONDITIONS_FIRST),
};

/** @type {PageSchema} */
export default {
  title: 'Choose a demo',
  path: 'choose-demo',
  uiSchema: {
    demo: radioUI({
      title: 'Choose a demo',
      labels: demoOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      demo: radioSchema(Object.keys(demoOptions)),
    },
    required: ['demo'],
  },
};
