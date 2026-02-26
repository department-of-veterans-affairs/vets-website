/**
 * @module config/form/pages/veteran-information
 * @description Standard form system configuration for Veteran Information page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidNameLength } from '../../shared/utils/validators/validators';

/**
 * Format title function for veteran's full name fields
 * Customizes labels to match old pattern design
 * @param {string} title - The default title (e.g., 'first name', 'last name')
 * @returns {string} The formatted title
 */
const formatVeteranNameTitle = title => {
  if (title === 'first or given name') return "Veteran's first or given name";
  if (title === 'last or family name') return "Veteran's last or family name";
  if (title === 'middle name') return "Veteran's middle initial";
  return title; // Keep defaults for middle name and suffix
};

const customVeteranNameSchema = {
  ...fullNameNoSuffixSchema,
  properties: {
    ...fullNameNoSuffixSchema.properties,
    middle: {
      type: 'string',
      maxLength: 1,
    },
  },
};

const customVeteranNameUISchema = formatTitle => {
  const baseSchema = fullNameNoSuffixUI(formatTitle);
  return {
    ...baseSchema,
    first: {
      ...baseSchema.first,
      'ui:validations': [
        ...baseSchema.first['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.veteranInformation?.veteranFullName?.first,
            12,
          );
        },
      ],
    },
    last: {
      ...baseSchema.last,
      'ui:validations': [
        ...baseSchema.last['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.veteranInformation?.veteranFullName?.last,
            18,
          );
        },
      ],
    },
  };
};

/**
 * uiSchema for Veteran Information page
 * Collects veteran's personal identification information
 */
export const veteranInformationUiSchema = {
  'ui:title': 'Who is the Veteran you are providing information for?',
  veteranInformation: {
    veteranFullName: customVeteranNameUISchema(formatVeteranNameTitle),
    dateOfBirth: dateOfBirthUI({
      title: "Veteran's date of birth",
      errorMessages: {
        required: 'Date of birth is required',
      },
    }),
  },
};

/**
 * JSON Schema for Veteran Information page
 * Validates veteran identification fields
 */
export const veteranInformationSchema = {
  type: 'object',
  required: ['veteranInformation'],
  properties: {
    veteranInformation: {
      type: 'object',
      required: ['veteranFullName', 'dateOfBirth'],
      properties: {
        veteranFullName: customVeteranNameSchema,
        dateOfBirth: dateOfBirthSchema,
      },
    },
  },
};
