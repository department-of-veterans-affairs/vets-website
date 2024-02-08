import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import DemographicField from '../../../components/FormFields/DemographicViewField';
import { DemographicInfoDescription } from '../../../components/FormDescriptions';
import ShortFormAlert from '../../../components/FormAlerts/ShortFormAlert';
import { isShortFormEligible } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

const {
  isAmericanIndianOrAlaskanNative,
  isAsian,
  isBlackOrAfricanAmerican,
  isNativeHawaiianOrOtherPacificIslander,
  isSpanishHispanicLatino,
  isWhite,
  hasDemographicNoAnswer,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:dmShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: formData => !isShortFormEligible(formData),
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
      'ui:options': {
        hideIf: formData => !formData['view:isLoggedIn'],
      },
    },
    'view:demographicCategories': {
      'ui:title': ' ',
      'ui:description': DemographicInfoDescription,
      'ui:field': DemographicField,
      isAmericanIndianOrAlaskanNative: {
        'ui:title': 'American Indian or Alaskan Native',
      },
      isSpanishHispanicLatino: {
        'ui:title': ' Hispanic, Latino, or Spanish',
      },
      isAsian: {
        'ui:title': 'Asian',
      },
      isBlackOrAfricanAmerican: {
        'ui:title': 'Black or African American',
      },
      isNativeHawaiianOrOtherPacificIslander: {
        'ui:title': 'Native Hawaiian or Other Pacific Islander',
      },
      isWhite: {
        'ui:title': 'White',
      },
      hasDemographicNoAnswer: {
        'ui:title': 'Prefer not to answer',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:dmShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      'view:demographicCategories': {
        type: 'object',
        required: [],
        properties: {
          isAmericanIndianOrAlaskanNative,
          isAsian,
          isBlackOrAfricanAmerican,
          isSpanishHispanicLatino,
          isNativeHawaiianOrOtherPacificIslander,
          isWhite,
          hasDemographicNoAnswer,
        },
      },
    },
  },
};
