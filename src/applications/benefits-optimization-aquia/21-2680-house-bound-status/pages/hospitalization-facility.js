/**
 * @module config/form/pages/hospitalization-facility
 * @description Standard form system configuration for Hospitalization Facility page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import React from 'react';
import {
  textUI,
  titleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getHospitalizationFacilityTitle } from '../utils';

/**
 * uiSchema for Hospitalization Facility page
 * Collects hospital/facility name and address
 */
export const hospitalizationFacilityUiSchema = {
  ...titleUI(({ formData }) => getHospitalizationFacilityTitle(formData)),
  hospitalizationFacility: {
    facilityName: textUI({
      title: 'Name of hospital',
    }),
    facilityAddress: {
      ...addressNoMilitaryUI({
        labels: {
          street2: 'Apt./Unit Number',
        },
      }),
      'ui:description': () => (
        <h4 className="vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--base vads-u-line-height--3 vads-u-margin-top--2 vads-u-margin-bottom--1">
          Address of hospital
        </h4>
      ),
    },
  },
};

/**
 * JSON Schema for Hospitalization Facility page
 * Validates facility name and address fields
 */
// Customize address schema to add maxLength constraints for hospital address
const customHospitalAddressSchema = {
  ...addressNoMilitarySchema(),
  properties: {
    ...addressNoMilitarySchema({
      omit: ['street3'],
    }).properties,
    street: {
      type: 'string',
      maxLength: 30,
    },
    street2: {
      type: 'string',
      maxLength: 5,
    },
  },
};

export const hospitalizationFacilitySchema = {
  type: 'object',
  required: ['hospitalizationFacility'],
  properties: {
    hospitalizationFacility: {
      type: 'object',
      required: ['facilityName', 'facilityAddress'],
      properties: {
        facilityName: {
          type: 'string',
          maxLength: 100,
        },
        facilityAddress: customHospitalAddressSchema,
      },
    },
  },
};
