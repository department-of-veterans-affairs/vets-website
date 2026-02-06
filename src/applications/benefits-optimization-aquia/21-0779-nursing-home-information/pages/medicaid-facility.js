/**
 * @module config/form/pages/medicaid-facility
 * @description Standard form system configuration for Medicaid Facility page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Medicaid Facility page
 * Determines if nursing home is Medicaid-approved facility
 */
export const medicaidFacilityUiSchema = {
  medicaidFacility: {
    isMedicaidApprovedFacility: yesNoUI({
      title: 'Is the nursing home a Medicaid approved facility?',
    }),
  },
  'ui:options': {
    updateUiSchema: () => {
      return {
        medicaidFacility: {
          isMedicaidApprovedFacility: {
            'ui:description':
              "Your state's Medicaid program may use a different name.",
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Medicaid Facility page
 * Validates Medicaid facility status
 */
export const medicaidFacilitySchema = {
  type: 'object',
  required: ['medicaidFacility'],
  properties: {
    medicaidFacility: {
      type: 'object',
      required: ['isMedicaidApprovedFacility'],
      properties: {
        isMedicaidApprovedFacility: yesNoSchema,
      },
    },
  },
};
