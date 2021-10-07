import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
// import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import DemographicField from '../../../components/DemographicField';

const {
  isAmericanIndianOrAlaskanNative,
  isAsian,
  isBlackOrAfricanAmerican,
  isNativeHawaiianOrOtherPacificIslander,
  isSpanishHispanicLatino,
  isWhite,
} = fullSchemaHca.properties;

const StatisticsInfo = (
  <div>
    <p>
      What is your race, ethnicity, or origin? (Please check all that apply)
    </p>
    <p style={{ color: 'gray' }}>
      Information is gathered for statistical purposes only
    </p>
  </div>
);

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    'view:demographicCategories': {
      'ui:field': DemographicField,
      // 'ui:description': 'What is your race, ethnicity, or origin? (Please check all that apply)',
      'ui:description': StatisticsInfo,
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
      noAnswer: {
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
          isSpanishHispanicLatino,
          isAmericanIndianOrAlaskanNative,
          isBlackOrAfricanAmerican,
          isNativeHawaiianOrOtherPacificIslander,
          isAsian,
          isWhite,
          // noAnswer,
        },
      },
    },
  },
};
