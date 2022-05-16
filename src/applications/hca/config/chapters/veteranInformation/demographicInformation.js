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
  hasDemographicNoAnswer,
} = fullSchemaHca.properties;

import {
  shortFormMessage,
  HIGH_DISABILITY,
  emptyObjectSchema,
} from '../../../helpers';

const demographicQuestion =
  'What is your race, ethnicity, or origin? (Please check all that apply.)';

const DemographicInfoDescription = () => {
  return (
    <>
      <div>
        <p id="demographic-question-label" className="vads-u-margin-bottom--1">
          {demographicQuestion}
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
    'view:dmShortFormMessage': {
      'ui:description': shortFormMessage,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
    },
    'view:demographicDescription': {
      'ui:description': DemographicInfoDescription,
    },
    'view:demographicCategories': {
      'ui:field': DemographicField,
      'ui:title': ' ',
      isAmericanIndianOrAlaskanNative: {
        // 'ui:title': 'American Indian or Alaskan Native',
        'ui:title': (
          <span
            aria-label={`${demographicQuestion} American Indian or Alaskan Native`}
          >
            American Indian or Alaskan Native
          </span>
        ),
      },
      isSpanishHispanicLatino: {
        // 'ui:title': ' Hispanic, Latino, or Spanish',
        'ui:title': (
          <span
            aria-label={`${demographicQuestion} Hispanic, Latino, or Spanish`}
          >
            Hispanic, Latino, or Spanish
          </span>
        ),
      },
      isAsian: {
        // 'ui:title': 'Asian',
        'ui:title': (
          <span aria-label={`${demographicQuestion} Asian`}>Asian</span>
        ),
      },
      isBlackOrAfricanAmerican: {
        // 'ui:title': 'Black or African American',
        'ui:title': (
          <span aria-label={`${demographicQuestion} Black or African American`}>
            Black or African American
          </span>
        ),
      },
      isNativeHawaiianOrOtherPacificIslander: {
        // 'ui:title': 'Native Hawaiian or Other Pacific Islander',
        'ui:title': (
          <span
            aria-label={`${demographicQuestion} Native Hawaiian or Other Pacific Islander`}
          >
            Native Hawaiian or Other Pacific Islander
          </span>
        ),
      },
      isWhite: {
        // 'ui:title': 'White',
        'ui:title': (
          <span aria-label={`${demographicQuestion} White`}>White</span>
        ),
      },
      hasDemographicNoAnswer: {
        // 'ui:title': 'Prefer not to answer',
        'ui:title': (
          <span aria-label={`${demographicQuestion} Prefer not to answer`}>
            Prefer not to answer
          </span>
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:dmShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      'view:demographicDescription': emptyObjectSchema,
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
