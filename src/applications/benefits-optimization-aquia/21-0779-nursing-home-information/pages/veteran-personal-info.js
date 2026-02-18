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

import { isPatientVeteran } from '../utils';

/**
 * uiSchema for Veteran Personal Info page
 * Collects veteran name and date of birth
 */
export const veteranPersonalInfoUiSchema = {
  'ui:title': "Veteran's name and date of birth",
  veteranPersonalInfo: {
    fullName: {
      ...fullNameNoSuffixUI(),
      middle: {
        ...fullNameNoSuffixUI().middle,
        'ui:title': 'Middle initial',
      },
    },
    dateOfBirth: dateOfBirthUI(),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const patientIsVeteran = isPatientVeteran(data);

      const subtitle = patientIsVeteran
        ? 'Tell us about the Veteran in the nursing home'
        : 'Tell us about the Veteran who is connected to the patient';

      return {
        'ui:description': subtitle,
      };
    },
  },
};

/**
 * JSON Schema for Veteran Personal Info page
 * Validates veteran name and date of birth
 */
const fullNameSchemaWithMiddleInitial = {
  ...fullNameNoSuffixSchema,
  properties: {
    ...fullNameNoSuffixSchema.properties,
    first: {
      type: 'string',
      maxLength: 12,
    },
    middle: {
      type: 'string',
      maxLength: 1,
    },
    last: {
      type: 'string',
      maxLength: 18,
    },
  },
};

export const veteranPersonalInfoSchema = {
  type: 'object',
  required: ['veteranPersonalInfo'],
  properties: {
    veteranPersonalInfo: {
      type: 'object',
      required: ['fullName', 'dateOfBirth'],
      properties: {
        fullName: fullNameSchemaWithMiddleInitial,
        dateOfBirth: dateOfBirthSchema,
      },
    },
  },
};
