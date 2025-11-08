import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const relationshipOptions = {
  stateCemetery: "I'm from a state cemetery",
  tribalOrganization: "I'm from a tribal organization",
};

export const relationshipToVeteranPage = {
  uiSchema: {
    ...titleUI('Relationship to the Veteran'),
    burialInformation: {
      relationshipToVeteran: radioUI({
        title: 'What is your relationship to the Veteran?',
        labels: relationshipOptions,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      burialInformation: {
        type: 'object',
        required: ['relationshipToVeteran'],
        properties: {
          relationshipToVeteran: radioSchema(Object.keys(relationshipOptions)),
        },
      },
    },
  },
};
