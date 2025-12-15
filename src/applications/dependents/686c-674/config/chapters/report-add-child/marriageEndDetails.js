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
          Death: 'Their former spouse died',
          Divorce: 'They divorced',
          Annulment: 'They got an annulment',
          Other: 'Some other way',
        },
      }),
    },
    marriageEndDescription: {
      'ui:title': 'Briefly describe how the marriage ended',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Provide details on how the marriage ended.',
      },
      'ui:options': {
        expandUnder: 'marriageEndReason',
        expandUnderCondition: 'Other',
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema, _uiSchema, index) => {
        const childData = formData?.childrenToAdd?.[index];

        if (childData?.hasChildEverBeenMarried === false) {
          childData.marriageEndDate = undefined;
          childData.marriageEndReason = undefined;
          childData.marriageEndDescription = undefined;
        }

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
  schema: {
    type: 'object',
    required: ['marriageEndDate', 'marriageEndReason'],
    properties: {
      marriageEndDate: currentOrPastDateSchema,
      marriageEndReason: radioSchema([
        'Death',
        'Divorce',
        'Annulment',
        'Other',
      ]),
      marriageEndDescription: {
        type: 'string',
      },
    },
  },
};
