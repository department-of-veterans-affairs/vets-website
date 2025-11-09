/**
 * @module config/form/pages/hospitalization-facility
 * @description Standard form system configuration for Hospitalization Facility page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  textUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Hospitalization Facility page
 * Collects hospital/facility name and address
 */
export const hospitalizationFacilityUiSchema = {
  'ui:title': 'Hospital or facility information',
  hospitalizationFacility: {
    facilityName: textUI({
      title: 'Name of hospital or facility',
    }),
    facilityAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Hospital is on a United States military base outside of the U.S.',
      },
    }),
  },
};

/**
 * JSON Schema for Hospitalization Facility page
 * Validates facility name and address fields
 */
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
        facilityAddress: addressSchema(),
      },
    },
  },
};
