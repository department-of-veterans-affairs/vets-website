/**
 * @module config/form/pages/veteran-information
 * @description Standard form system configuration for Veteran Information page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Format title function for veteran's full name fields
 * Customizes labels to match old pattern design
 * @param {string} title - The default title (e.g., 'first name', 'last name')
 * @returns {string} The formatted title
 */
const formatVeteranNameTitle = title => {
  if (title === 'first or given name') return "Veteran's first or given name";
  if (title === 'last or family name') return "Veteran's last or family name";
  return title; // Keep defaults for middle name and suffix
};

/**
 * uiSchema for Veteran Information page
 * Collects veteran's personal identification information
 */
export const veteranInformationUiSchema = {
  'ui:title': 'Who is the Veteran you are providing information for?',
  veteranInformation: {
    veteranFullName: firstNameLastNameNoSuffixUI(formatVeteranNameTitle),
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
        veteranFullName: firstNameLastNameNoSuffixSchema,
        dateOfBirth: dateOfBirthSchema,
      },
    },
  },
};
