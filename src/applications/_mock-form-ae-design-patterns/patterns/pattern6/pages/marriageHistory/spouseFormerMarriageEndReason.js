import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

const spouseFormerMarriageLabels = {
  Death: 'Spouse death',
  Divorce: 'Divorce',
  Annulment: 'Annulment',
  NOT_LISTED_HERE: 'Not listed here',
};

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'How did the marriage end?';
    }),
    reasonMarriageEnded: radioUI({
      //   title: 'How did your spouse’s previous marriage end?',
      title: '',
      labels: spouseFormerMarriageLabels,
      labelHeaderLevel: '3',
    }),
    otherReasonMarriageEnded: {
      'ui:title': 'Tell us how the marriage ended',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        rows: 5,
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Not listed here',
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    'ui:options': {
      // Use updateSchema to set
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherReasonMarriageEnded['ui:collapsed']) {
          return { ...formSchema, required: ['reasonMarriageEnded'] };
        }
        return {
          ...formSchema,
          required: ['reasonMarriageEnded', 'otherReasonMarriageEnded'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['reasonMarriageEnded'],
    properties: {
      reasonMarriageEnded: radioSchema(Object.keys(spouseFormerMarriageLabels)),
      otherReasonMarriageEnded: {
        type: 'string',
      },
    },
  },
};
