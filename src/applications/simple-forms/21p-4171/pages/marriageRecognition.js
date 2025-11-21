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
    ...titleUI('Marriage recognition'),
    marriage: {
      generallyKnownAsMarried: yesNoUI(
        'Were/are the Veteran and the claimed spouse generally known as married?',
      ),
      everDenied: yesNoUI(
        'Did/do either the Veteran or claimed spouse ever deny the marriage?',
      ),
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
  },
  schema: {
    type: 'object',
    properties: {
      marriage: {
        type: 'object',
        properties: {
          generallyKnownAsMarried: yesNoSchema,
          everDenied: yesNoSchema,
          witnessConsidersMarried: yesNoSchema,
          reasonsForBelief: {
            ...textareaSchema,
            maxLength: 1000,
          },
        },
        required: [
          'generallyKnownAsMarried',
          'everDenied',
          'witnessConsidersMarried',
        ],
      },
    },
    required: ['marriage'],
  },
};
