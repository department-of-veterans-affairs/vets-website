import { radioUI, radioSchema } from './radioPattern';
import VaTextInputField from '../web-component-fields/VaTextInputField';

export const relationshipToVeteranUI = personTitle => {
  const person = personTitle ?? 'veteran';

  return {
    relationshipToVeteran: radioUI({
      title: `What’s your relationship to the ${person}?`,
      labels: {
        spouse: `I’m the ${person}’s spouse`,
        child: `I’m the ${person}’s child`,
        parent: `I’m the ${person}’s parent`,
        executor: `I’m the ${person}’s executor or administrator of estate`,
        other: 'We don’t have a relationship that’s listed here',
      },
    }),
    otherRelationshipToVeteran: {
      'ui:title': `Since your relationship with the ${person} was not listed, please describe it here`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
    },
    'ui:options': {
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
