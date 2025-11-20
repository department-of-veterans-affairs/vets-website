import {
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Marriage references'),
    marriage: {
      heardReferToEachOther: yesNoUI(
        'Had/have you ever heard the Veteran or the claimed spouse refer to each other as married to one another?',
      ),
      referenceDate: {
        ...currentOrPastDateUI('Date'),
        'ui:options': {
          expandUnder: 'heardReferToEachOther',
          expandUnderCondition: true,
        },
      },
      referencePlace: {
        ...textUI('Place'),
        'ui:options': {
          expandUnder: 'heardReferToEachOther',
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
          heardReferToEachOther: yesNoSchema,
          referenceDate: currentOrPastDateSchema,
          referencePlace: {
            ...textSchema,
            maxLength: 100,
          },
        },
        required: ['heardReferToEachOther'],
      },
    },
    required: ['marriage'],
  },
};
