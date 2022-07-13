import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import DemographicField from '../../../components/DemographicField';
import { ShortFormMessage } from '../../../components/FormAlerts';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const {
  isAmericanIndianOrAlaskanNative,
  isAsian,
  isBlackOrAfricanAmerican,
  isNativeHawaiianOrOtherPacificIslander,
  isSpanishHispanicLatino,
  isWhite,
  hasDemographicNoAnswer,
} = fullSchemaHca.properties;

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
const DemographicInfoDescription = () => {
  return (
    <>
      <div tabIndex="0" style={{ outline: 'none' }}>
        <p id="demographic-question-label" className="vads-u-margin-bottom--1">
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
/* eslint-enable */

export default {
  uiSchema: {
    'view:dmShortFormMessage': {
      'ui:description': ShortFormMessage,
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
