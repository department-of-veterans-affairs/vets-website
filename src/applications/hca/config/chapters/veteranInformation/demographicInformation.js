import React from 'react';
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

const DemographicInfoDescription = props => {
  return (
    <>
      <PrefillMessage {...props} />

      <div>
        <p className="vads-u-margin-bottom--1">
          What is your race, ethnicity, or origin? (Please check all that
          apply.)
        </p>

        <p className="vads-u-color--gray-medium vads-u-margin-top--0 vads-u-margin-bottom--0">
          Information is gathered for statistical purposes only.
        </p>
      </div>
    </>
  );
};

export default {
  uiSchema: {
    'ui:description': DemographicInfoDescription,
    'view:demographicCategories': {
      'ui:field': DemographicField,
      'ui:title': ' ',
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
