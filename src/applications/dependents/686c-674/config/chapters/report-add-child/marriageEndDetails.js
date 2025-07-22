import {
  titleUI,
  radioUI,
  radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export const marriageEndDetails = {
  uiSchema: {
    ...titleUI({
      title: 'How and when marriage ended',
    }),
    marriageEndDate: {
      ...currentOrPastDateUI({
        title: 'When did this marriage end?',
        errorMessages: {
          pattern: 'Enter a valid date',
          required: 'Enter the date the marriage ended',
        },
      }),
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
      'ui:title': 'Briefly describe how the marriage ended',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Provide details on how the marriage ended.',
      },
      'ui:required': (formData, index) => {
        const addMode =
          formData?.childrenToAdd?.[index]?.marriageEndReason === 'other';
        const editMode = formData?.marriageEndReason === 'other';
        return addMode || editMode;
      },
      'ui:options': {
        expandUnder: 'marriageEndReason',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
        preserveHiddenData: true,
        updateSchema: (formData, formSchema) => {
          if (formSchema.properties.marriageEndDescription['ui:collapsed']) {
            return {
              ...formSchema,
              required: ['marriageEndDate', 'marriageEndReason'],
            };
          }
          return {
            ...formSchema,
            required: [
              'marriageEndDate',
              'marriageEndReason',
              'marriageEndDescription',
            ],
          };
        },
      },
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
      marriageEndDescription: {
        type: 'string',
      },
    },
  },
};
