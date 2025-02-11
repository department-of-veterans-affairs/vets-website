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
      'ui:required': () => true,
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
      ...textUI({
        title: 'Briefly describe how the marriage ended',
        required: (formData, index) =>
          formData?.childrenToAdd?.[index]?.marriageEndReason === 'other' ||
          formData?.marriageEndReason === 'other',
        hideIf: (formData, index) =>
          !(
            formData?.childrenToAdd?.[index]?.marriageEndReason === 'other' ||
            formData?.marriageEndReason === 'other'
          ),
        errorMessages: {
          required: 'Provide details on how the marriage ended.',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['marriageEndDate', 'marriageEndReason'],
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
