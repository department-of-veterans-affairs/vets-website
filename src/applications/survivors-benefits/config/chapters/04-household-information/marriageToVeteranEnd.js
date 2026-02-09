import {
  radioUI,
  radioSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageEndOptions } from '../../../utils/labels';
import { customTextSchema } from '../../definitions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    howMarriageEnded: {
      ...radioUI({
        title: 'How did the marriage end?',
        labels: marriageEndOptions,
        required: formData => formData.marriedToVeteranAtTimeOfDeath === false,
        labelHeaderLevel: 3,
      }),
    },
    marriageEndedExplanation: {
      ...textUI({
        title: 'Tell us how the marriage ended',
        required: formData => formData?.howMarriageEnded === 'other',
      }),
      'ui:options': {
        expandUnder: 'howMarriageEnded',
        expandUnderCondition: 'other',
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      howMarriageEnded: radioSchema(Object.keys(marriageEndOptions)),
      marriageEndedExplanation: customTextSchema,
    },
  },
};
