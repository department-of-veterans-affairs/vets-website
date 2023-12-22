import get from '@department-of-veterans-affairs/platform-forms-system/get';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { relationshipLabels } from '../../../utils/labels';

const { relationship } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': 'Relationship to Veteran',
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
      other: {
        'ui:title': 'Describe your relationship to the deceased Veteran',
        'ui:required': form => get('relationship.type', form) === 'other',
        'ui:options': {
          hideIf: form => get('relationship.type', form) !== 'other',
        },
        'ui:errorMessages': {
          required: 'Enter your relationship to the deceased Veteran',
        },
      },
      isEntity: {
        'ui:title': 'Claiming as a firm, corporation or state agency',
        'ui:options': {
          hideIf: form => get('relationship.type', form) !== 'other',
          widgetClassNames: 'schemaform-label-no-top-margin',
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
