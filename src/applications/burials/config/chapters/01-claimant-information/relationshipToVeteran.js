import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
// import { relationshipToVeteranUI, relationshipToVeteranSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { relationshipLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

const { relationship } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Relationship to Veteran'),
    relationship: {
      type: {
        'ui:title': 'What’s your relationship to the deceased Veteran?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: relationshipLabels,
        },
        'ui:errorMessages': {
          required: 'Select your relationship to the deceased Veteran',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['relationship'],
    properties: {
      relationship,
    },
  },
};
