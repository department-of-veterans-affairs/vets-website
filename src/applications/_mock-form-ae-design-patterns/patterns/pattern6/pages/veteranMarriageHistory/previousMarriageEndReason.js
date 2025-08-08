import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

const spouseFormerMarriageLabels = {
  Death: 'Spouse death',
  Divorce: 'Divorce',
  Annulment: 'Annulment',
  NOT_LISTED_HERE: 'Not listed here',
};

export default {
  uiSchema: {
    reasonMarriageEnded: {
      'ui:title': 'How did your marriage end?',
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
