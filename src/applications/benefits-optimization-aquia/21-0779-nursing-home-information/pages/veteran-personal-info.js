/**
 * @module config/form/pages/veteran-personal-info
 * @description Standard form system configuration for Veteran Personal Info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { isPatientVeteran } from './helpers';

/**
 * uiSchema for Veteran Personal Info page
 * Collects veteran name and date of birth
 */
export const veteranPersonalInfoUiSchema = {
  'ui:title': "Veteran's name and date of birth",
  veteranPersonalInfo: {
    fullName: fullNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const patientIsVeteran = isPatientVeteran(data);

      const subtitle = patientIsVeteran
        ? 'Tell us about the veteran in the nursing home'
        : 'Tell us about the Veteran who is connected to the patient';

      return {
        'ui:description': subtitle,
        veteranPersonalInfo: {
          dateOfBirth: {
            'ui:description': 'Enter the date as MM/DD/YYYY',
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Veteran Personal Info page
 * Validates veteran name and date of birth
 */
export const veteranPersonalInfoSchema = {
  type: 'object',
  required: ['veteranPersonalInfo'],
  properties: {
    veteranPersonalInfo: {
      type: 'object',
      required: ['fullName', 'dateOfBirth'],
      properties: {
        fullName: fullNameNoSuffixSchema,
        dateOfBirth: dateOfBirthSchema,
      },
    },
  },
};
