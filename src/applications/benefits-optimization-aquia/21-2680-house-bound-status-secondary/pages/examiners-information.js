/**
 * @module pages/examiners-information
 * @description Standard form system configuration for Examiner's Information page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects the examiner's NPI number, medical facility name,
 * mailing address, and telephone number.
 */

import React from 'react';
import {
  textUI,
  titleUI,
  addressUI,
  addressSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Examiner's Information page
 * NPI, facility name, mailing address, and phone number
 */
export const examinersInformationUiSchema = {
  ...titleUI('Examiner\u2019s information'),
  npiNumber: textUI({
    title: 'National Provider Identifier (NPI) number of examiner',
    errorMessages: {
      required: 'NPI number is required',
    },
  }),
  medicalFacilityName: textUI({
    title: 'Name of medical facility',
    errorMessages: {
      required: 'Name of medical facility is required',
    },
  }),
  mailingAddress: {
    ...addressUI({
      labels: {
        militaryCheckbox:
          'Medical facility is on a U.S. military base outside of the United States.',
      },
      omit: ['street3'],
    }),
    'ui:description': () => (
      <div>
        <h4>Mailing address</h4>
        <p>
          We
          {'\u2019'}
          ll send any important information about your application to this
          address.
        </p>
      </div>
    ),
  },
  facilityPhone: internationalPhoneUI('Telephone number of medical facility'),
};

/**
 * JSON Schema for Examiner's Information page
 * Validates NPI, facility name, address, and phone
 */
export const examinersInformationSchema = {
  type: 'object',
  required: ['npiNumber', 'medicalFacilityName'],
  properties: {
    npiNumber: { type: 'string' },
    medicalFacilityName: { type: 'string' },
    mailingAddress: addressSchema({ omit: ['street3'] }),
    facilityPhone: internationalPhoneSchema(),
  },
};
