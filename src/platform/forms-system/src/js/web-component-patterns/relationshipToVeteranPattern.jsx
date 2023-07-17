import { radioUI, radioSchema } from './radioPattern';
import VaTextInputField from '../web-component-fields/VaTextInputField';

const defaultLabels = {
  spouse: 'Spouse',
  child: 'Child',
  parent: 'Parent',
  executor: 'Executor/Administrator of Estate',
  other: 'A relationship not listed here',
};

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
      labels: customLabels ?? defaultLabels,
    }),
    otherRelationshipToVeteran: {
      'ui:title':
        otherRelationshipToVeteranTitle ??
        'Since your relationship with the veteran was not listed, please describe it here',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: otherRelationshipKey ?? 'other',
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
  const labelKeys = customLabels
    ? Object.keys(customLabels)
    : Object.keys(defaultLabels);
  return {
    type: 'object',
    properties: {
      relationshipToVeteran: radioSchema(labelKeys),
      otherRelationshipToVeteran: {
        type: 'string',
      },
    },
    required: ['relationshipToVeteran'],
  };
};
