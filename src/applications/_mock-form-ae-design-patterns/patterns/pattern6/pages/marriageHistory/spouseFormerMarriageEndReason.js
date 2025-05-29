import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import { MarriageEndReasonTitle } from '../../helpers/dynamicSpouseNameTitles';

const spouseFormerMarriageLabels = {
  Death: 'Spouse death',
  Divorce: 'Divorce',
  Annulment: 'Annulment',
  NOT_LISTED_HERE: 'Not listed here',
};

export default {
  uiSchema: {
    'ui:title': MarriageEndReasonTitle,
    // ...arrayBuilderItemSubsequentPageTitleUI(({ formContext }) => {
    //   const first =
    //     formContext?.formData?.spouseFullName?.first ?? 'your current spouse';
    //   return `How did ${first}'s previous marriage end?`;
    // }),
    // reasonMarriageEnded: radioUI({
    //   title: MarriageEndReasonTitle,
    //   labels: spouseFormerMarriageLabels,
    //   labelHeaderLevel: '3',
    // }),
    // reasonMarriageEnded: radioUI({
    //   labels: spouseFormerMarriageLabels,
    //   labelHeaderLevel: '3',
    // }),
    reasonMarriageEnded: {
      'ui:title': ' ',
      // 'ui:title': MarriageEndReasonTitle,
      // 'ui:title': props => MarriageEndReasonTitle(props),
      'ui:widget': 'radio',
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        labels: spouseFormerMarriageLabels,
        labelHeaderLevel: '3',
      },
    },
    otherReasonMarriageEnded: {
      'ui:title': 'Tell us how the marriage ended',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'NOT_LISTED_HERE',
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
