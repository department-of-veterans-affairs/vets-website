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
import { isValidNameLength } from '../../shared/utils/validators/validators';

const customVeteranNameUISchema = () => {
  const baseSchema = fullNameNoSuffixUI();
  return {
    ...baseSchema,
    first: {
      ...baseSchema.first,
      'ui:title': 'First or given name',
      'ui:validations': [
        ...baseSchema.first['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.veteranPersonalInfo?.fullName?.first,
            12,
          );
        },
      ],
    },
    middle: {
      ...baseSchema.middle,
      'ui:title': 'Middle initial',
    },
    last: {
      ...baseSchema.last,
      'ui:title': 'Last or family name',
      'ui:validations': [
        ...baseSchema.last['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.veteranPersonalInfo?.fullName?.last,
            18,
          );
        },
      ],
    },
  };
};

/**
 * uiSchema for Veteran Personal Info page
 * Collects veteran name and date of birth
 */
export const veteranPersonalInfoUiSchema = {
  'ui:title': "Veteran's name and date of birth",
  veteranPersonalInfo: {
    fullName: customVeteranNameUISchema(),
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
    },
    middle: {
      type: 'string',
      maxLength: 1,
    },
    last: {
      type: 'string',
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
