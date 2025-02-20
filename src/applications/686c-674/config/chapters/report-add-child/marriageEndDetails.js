import {
  titleUI,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const marriageEndDetails = {
  uiSchema: {
    ...titleUI({
      title: 'How and when marriage ended',
    }),
    marriageEndDate: {
      ...currentOrPastDateUI('When did this marriage end?'),
      'ui:errorMessages': {
        required: 'Enter the date the marriage ended.',
      },
    },
    marriageEndReason: {
      ...radioUI({
        title: 'How did the marriage end?',
        labels: {
          death: 'Their former spouse died',
          divorce: 'They divorced',
          annulment: 'They got an annulment',
          other: 'Some other way',
        },
      }),
    },
    marriageEndDescription: {
      ...textUI('Briefly describe how the marriage ended'),
      'ui:required': (formData, index) =>
        formData?.childrenToAdd?.[index]?.marriageEndReason === 'other' ||
        formData?.marriageEndReason === 'other',
      'ui:options': {
        expandUnder: 'marriageEndReason',
        expandUnderCondition: (value, _formData) => {
          return value === 'other';
        },
      },
      'ui:errorMessages': {
        required: 'Provide details on how the marriage ended.',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      marriageEndDate: currentOrPastDateSchema,
      marriageEndReason: radioSchema([
        'death',
        'divorce',
        'annulment',
        'other',
      ]),
      marriageEndDescription: textSchema,
    },
  },
};
