import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageTypeOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  uiSchema: {
    marriageType: radioUI({
      title: 'How did you get married?',
      labels: marriageTypeOptions,
      labelHeaderLevel: 3,
    }),
    marriageTypeOther: {
      ...textUI({
        title: 'Tell us how you got married',
        required: formData => formData?.marriageType === 'OTHER_WAY',
      }),
      'ui:options': {
        hint:
          'You can enter common law, proxy (someone else represented you or your spouse at your marriage ceremony), tribal ceremony, or another way.',
        expandUnder: 'marriageType',
        expandUnderCondition: 'OTHER_WAY',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageType'],
    properties: {
      marriageType: radioSchema(Object.keys(marriageTypeOptions)),
      marriageTypeOther: textSchema,
    },
  },
};
