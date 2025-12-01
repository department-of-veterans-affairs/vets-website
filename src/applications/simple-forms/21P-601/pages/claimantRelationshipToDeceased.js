import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

const relationshipOptions = {
  executor: "I'm the executor of the beneficiary's estate",
  creditor: "I'm a creditor",
  other: "We don't have a relationship that's listed here",
};

export default {
  uiSchema: {
    ...titleUI('Your relationship to the beneficiary'),
    relationshipToDeceased: radioUI({
      title: "What's your relationship to the beneficiary?",
      labels: relationshipOptions,
    }),
    relationshipToDeceasedOther: {
      'ui:title': `Describe your relationship to the beneficiary`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToDeceased',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Enter your relationship to the beneficiary`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.relationshipToDeceasedOther['ui:collapsed']) {
          return { ...formSchema, required: ['relationshipToDeceased'] };
        }
        return {
          ...formSchema,
          required: ['relationshipToDeceased', 'relationshipToDeceasedOther'],
        };
      },
    },
  },

  schema: {
    type: 'object',
    required: ['relationshipToDeceased'],
    properties: {
      relationshipToDeceased: radioSchema(Object.keys(relationshipOptions)),
      relationshipToDeceasedOther: {
        type: 'string',
      },
    },
  },
};
