import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

const formerMarriageLabels = {
  Death: 'Spouse death',
  Divorce: 'Divorce',
  Annulment: 'Annulment',
  NOT_LISTED_HERE: 'Not listed here',
};

export default {
  uiSchema: {
    'ui:title': 'How did your marriage end?',
    reasonMarriageEnded: {
      'ui:title': ' ',
      'ui:widget': 'radio',
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        labels: formerMarriageLabels,
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
      reasonMarriageEnded: radioSchema(Object.keys(formerMarriageLabels)),
      otherReasonMarriageEnded: {
        type: 'string',
      },
    },
  },
};
