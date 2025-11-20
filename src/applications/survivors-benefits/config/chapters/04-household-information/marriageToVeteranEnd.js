import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageEndOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Marriage to Veteran'),
    marriageEndReason: {
      ...radioUI({
        title: 'How did the marriage end?',
        labels: marriageEndOptions,
        required: formData => formData.marriedAtDeath === false,
      }),
    },
    marriageEndOtherReason: {
      ...textUI({
        title: 'Tell us how the marriage ended',
        required: formData => formData?.marriageEndReason === 'OTHER',
      }),
      'ui:options': {
        expandUnder: 'marriageEndReason',
        expandUnderCondition: 'OTHER',
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      marriageEndReason: radioSchema(Object.keys(marriageEndOptions)),
      marriageEndOtherReason: textSchema,
    },
  },
};
