// import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  radioUI,
  radioSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import { relationshipLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

// const { relationship } = fullSchemaBurials.properties;

export const relationshipToVeteranUI = options => {
  const { personTitle } =
    typeof options === 'object' ? options : { personTitle: options };
  const person = personTitle ?? 'Veteran';

  return {
    relationshipToVeteran: radioUI({
      title: `Whats your relationship to the ${person}?`,
      labels: relationshipLabels,
      errorMessages: {
        required: `Select your relationship to the ${person}`,
      },
      labelHeaderLevel: '',
    }),
    otherRelationshipToVeteran: {
      'ui:title': `Since your relationship with the ${person} was not listed, please describe it here`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'otherFamily',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Enter your relationship to the ${person}`,
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

const relationshipToVeteranSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: radioSchema([
      'spouse',
      'child',
      'parent',
      'executor',
      'funeralDirector',
      'otherFamily',
    ]),
    otherRelationshipToVeteran: {
      type: 'string',
    },
  },
  required: ['relationshipToVeteran'],
};

export default {
  uiSchema: {
    ...relationshipToVeteranUI(),
    'ui:title': generateTitle('Relationship to Veteran'),
  },
  schema: relationshipToVeteranSchema,
};
