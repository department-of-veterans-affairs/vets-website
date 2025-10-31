import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { dicOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('DIC benefits'),
    dicType: radioUI({
      title:
        'What Dependency and indemnity compensation (DIC) benefit are you claiming?',
      labels: dicOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['dicType'],
    properties: {
      dicType: radioSchema(Object.keys(dicOptions)),
    },
  },
};
