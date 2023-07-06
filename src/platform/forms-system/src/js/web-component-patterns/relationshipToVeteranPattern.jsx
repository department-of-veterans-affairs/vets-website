import VaRadioField from '../web-component-fields/VaRadioField';
import VaTextInputField from '../web-component-fields/VaTextInputField';

export const relationshipToVeteranUI = (
  relationshipToVeteranTitle,
  relationshipToVeteranOtherTitle,
) => {
  return {
    relationshipToVeteran: {
      'ui:title':
        relationshipToVeteranTitle ??
        'What’s your relationship to the veteran?',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          spouse: 'Spouse',
          child: 'Child',
          parent: 'Parent',
          executor: 'Executor/Administrator of Estate',
          other: 'A relationship not listed here',
        },
      },
    },
    relationshipToVeteranOther: {
      'ui:title':
        relationshipToVeteranOtherTitle ??
        'Since your relationship with the veteran was not listed, please describe it here',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'other',
      },
    },
  };
};

export const relationshipToVeteranSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: {
      type: 'string',
      enum: ['spouse', 'child', 'parent', 'executor', 'other'],
    },
    relationshipToVeteranOther: {
      type: 'string',
    },
  },
  required: ['relationshipToVeteran'],
  if: {
    properties: {
      relationshipToVeteran: {
        const: 'other',
      },
    },
  },
  then: {
    required: ['relationshipToVeteranOther'],
  },
};
