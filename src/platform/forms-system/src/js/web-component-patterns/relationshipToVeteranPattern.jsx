import { radioUI, radioSchema } from './radioPattern';
import VaTextInputField from '../web-component-fields/VaTextInputField';

export const relationshipToVeteranUI = (
  relationshipToVeteranTitle,
  otherRelationshipToVeteranTitle,
) => {
  return {
    relationshipToVeteran: radioUI({
      title:
        relationshipToVeteranTitle ??
        'What’s your relationship to the veteran?',
      labels: {
        spouse: 'Spouse',
        child: 'Child',
        parent: 'Parent',
        executor: 'Executor/Administrator of Estate',
        other: 'A relationship not listed here',
      },
    }),
    otherRelationshipToVeteran: {
      'ui:title':
        otherRelationshipToVeteranTitle ??
        'Since your relationship with the veteran was not listed, please describe it here',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'other',
      },
    },
    'ui:options': {
      expandedContentFocus: true,
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherRelationshipToVeteran['ui:collapsed']) {
          return { ...formSchema, required: ['relationshipToVeteran'] };
        }

        return {
          ...formSchema,
          required: ['relationshipToVeteran', 'otherRelationshipToVeteran'],
        };
      },
    },
  };
};

export const relationshipToVeteranSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: radioSchema([
      'spouse',
      'child',
      'parent',
      'executor',
      'other',
    ]),
    otherRelationshipToVeteran: {
      type: 'string',
    },
  },
  required: ['relationshipToVeteran'],
};
