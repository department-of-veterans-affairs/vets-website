import {
  yesNoUI,
  yesNoSchema,
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your belief about the marriage'),
    witnessConsidersMarried: yesNoUI(
      'Did/do you consider the Veteran and the claimed spouse to be married?',
    ),
    reasonsForBelief: {
      ...textareaUI('Provide facts and reasons for such belief'),
      'ui:options': {
        expandUnder: 'witnessConsidersMarried',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      witnessConsidersMarried: yesNoSchema,
      reasonsForBelief: {
        ...textareaSchema,
        maxLength: 1000,
      },
    },
    required: ['witnessConsidersMarried'],
  },
};
