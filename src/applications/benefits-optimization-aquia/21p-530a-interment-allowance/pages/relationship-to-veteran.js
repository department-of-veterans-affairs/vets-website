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
      'view:relationshipToVeteran': radioUI({
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
        required: ['view:relationshipToVeteran'],
        properties: {
          'view:relationshipToVeteran': radioSchema(
            Object.keys(relationshipOptions),
          ),
        },
      },
    },
  },
};
