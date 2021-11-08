import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import DemographicField from '../../../components/DemographicField';

const {
  isGenderMan,
  isGenderWoman,
  isGenderTransMan,
  isGenderTransWoman,
  isGenderNonBinary,
  isGenderNotListed,
  isGenderPreferNoAnswer,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    'view:veteranGender': {
      'ui:field': DemographicField,
      'ui:title': 'What is your gender? (Please check all that apply.)',
      isGenderMan: {
        'ui:title': 'Man',
      },
      isGenderWoman: {
        'ui:title': 'Woman',
      },
      isGenderTransMan: {
        'ui:title': 'Transgender Man',
      },
      isGenderTransWoman: {
        'ui:title': 'Transgender Woman',
      },
      isGenderNonBinary: {
        'ui:title': 'Non-binary',
      },
      isGenderNotListed: {
        'ui:title': 'A gender not listed here',
      },
      isGenderPreferNoAnswer: {
        'ui:title': 'Prefer not to answer',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:demographicCategories': {
        type: 'object',
        properties: {
          isGenderMan,
          isGenderWoman,
          isGenderTransMan,
          isGenderTransWoman,
          isGenderNonBinary,
          isGenderNotListed,
          isGenderPreferNoAnswer,
        },
      },
    },
  },
};
