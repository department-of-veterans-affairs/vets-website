import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import DemographicField from '../../../components/DemographicField';

const {
  isAmericanIndianOrAlaskanNative,
  isAsian,
  isBlackOrAfricanAmerican,
  isNativeHawaiianOrOtherPacificIslander,
  isSpanishHispanicLatino,
  isWhite,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    'view:demographicCategories': {
      'ui:field': DemographicField,
      'ui:title': 'Which categories best describe you?',
      'ui:description': 'You may check more than one.',
      isSpanishHispanicLatino: {
        'ui:title': 'Spanish, Hispanic, or Latino',
      },
      isAmericanIndianOrAlaskanNative: {
        'ui:title': 'American Indian or Alaskan Native',
      },
      isBlackOrAfricanAmerican: {
        'ui:title': 'Black or African American',
      },
      isNativeHawaiianOrOtherPacificIslander: {
        'ui:title': 'Native Hawaiian or Other Pacific Islander',
      },
      isAsian: {
        'ui:title': 'Asian',
      },
      isWhite: {
        'ui:title': 'White',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:demographicCategories': {
        type: 'object',
        required: [],
        properties: {
          isSpanishHispanicLatino,
          isAmericanIndianOrAlaskanNative,
          isBlackOrAfricanAmerican,
          isNativeHawaiianOrOtherPacificIslander,
          isAsian,
          isWhite,
        },
      },
    },
  },
};
