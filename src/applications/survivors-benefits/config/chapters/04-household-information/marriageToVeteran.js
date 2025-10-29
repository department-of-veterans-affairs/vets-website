import {
  yesNoSchema,
  yesNoUI,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageEndOptions, marriageTypeOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  title: 'Marriage to Veteran',
  path: 'household/marriage-to-veteran',
  uiSchema: {
    ...titleUI('Marriage to Veteran'),
    marriedAtDeath: yesNoUI({
      title: 'Were you married to the Veteran at the time of their death?',
    }),
    marriageEndDetails: {
      'ui:field': 'ObjectField',
      'ui:options': {
        expandUnder: 'marriedAtDeath',
        expandUnderCondition: false,
        hideIf: formData => formData.marriedAtDeath !== false,
      },
      marriageEndReason: {
        ...radioUI({
          title: 'How did the marriage end?',
          labels: marriageEndOptions,
          required: formData => formData.marriedAtDeath === false,
        }),
      },
      marriageEndOtherReason: {
        ...textUI({
          title: 'Tell us how the marriage ended?',
          required: formData =>
            formData?.marriageEndDetails?.marriageEndReason === 'OTHER',
        }),
        'ui:options': {
          expandUnder: 'marriageEndReason',
          expandUnderCondition: 'OTHER',
        },
      },
    },
    marriageDate: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
    }),
    marriageEndDate: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
    }),
    placeOfMarriage: textUI({
      title: 'Place of marriage',
      hint: 'City, state or foreign country',
    }),
    placeMarriageEnded: textUI({
      title: 'Place marriage ended',
      hint: 'City, state or foreign country',
    }),
    marriageType: radioUI({
      title: 'How did you get married?',
      labels: marriageTypeOptions,
    }),
    marriageTypeOther: {
      ...textUI({
        title: 'Tell us how you got married.',
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
    required: [
      'marriedAtDeath',
      'marriageDate',
      'placeOfMarriage',
      'marriageType',
    ],
    properties: {
      marriedAtDeath: yesNoSchema,
      marriageEndDetails: {
        type: 'object',
        properties: {
          marriageEndReason: radioSchema(Object.keys(marriageEndOptions)),
          marriageEndOtherReason: textSchema,
        },
      },
      marriageDate: currentOrPastDateSchema,
      marriageEndDate: currentOrPastDateSchema,
      placeOfMarriage: textSchema,
      placeMarriageEnded: textSchema,
      marriageType: radioSchema(Object.keys(marriageTypeOptions)),
      marriageTypeOther: textSchema,
    },
  },
};
