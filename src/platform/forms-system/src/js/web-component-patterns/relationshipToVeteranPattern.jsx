import { radioUI, radioSchema } from './radioPattern';
import VaTextInputField from '../web-component-fields/VaTextInputField';

export const relationshipToVeteranUI = (
  relationshipToVeteranTitle,
  otherRelationshipToVeteranTitle,
  customLabels,
  otherRelationshipKey,
) => {
  return {
    relationshipToVeteran: radioUI({
      title:
        relationshipToVeteranTitle ??
        'What’s your relationship to the veteran?',
      labels: customLabels,
    }),
    otherRelationshipToVeteran: {
      'ui:title':
        otherRelationshipToVeteranTitle ??
        'Since your relationship with the veteran was not listed, please describe it here',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: otherRelationshipKey,
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

export const relationshipToVeteranSchema = customLabels => {
  return {
    type: 'object',
    properties: {
      relationshipToVeteran: radioSchema(Object.keys(customLabels)),
      otherRelationshipToVeteran: {
        type: 'string',
      },
    },
    required: ['relationshipToVeteran'],
  };
};
