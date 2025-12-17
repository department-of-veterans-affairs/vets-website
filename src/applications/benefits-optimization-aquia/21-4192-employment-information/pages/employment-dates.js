/**
 * @module config/form/pages/employment-dates
 * @description Standard form system configuration for Employment Dates page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { getVeteranName, getEmployerName } from './helpers';
import { MemorableDateUI } from '../components/memorable-date-ui';

/**
 * Generate page title
 * @param {Object} props - Props object with formData and formContext
 * @param {Object} props.formData - The form data
 * @returns {string} The page title
 */
const getPageTitle = ({ formData }) => {
  // Defensive: getVeteranName handles formData validation
  const veteranName = getVeteranName(formData);
  return `${veteranName}'s dates of employment`;
};

/**
 * Generate title for beginning date field
 */
const getBeginningDateTitle = formData => {
  if (!formData || typeof formData !== 'object')
    return 'Beginning date of employment';
  const veteranName = getVeteranName(formData);
  const employerName = getEmployerName(formData);
  return `When did ${veteranName} start working for ${employerName}?`;
};

/**
 * Generate title for ending date field
 */
const getEndingDateTitle = formData => {
  if (!formData || typeof formData !== 'object')
    return 'Ending date of employment';
  const veteranName = getVeteranName(formData);
  const employerName = getEmployerName(formData);
  return `When did ${veteranName} stop working for ${employerName}?`;
};

/**
 * Validates that ending date is not before beginning date
 * @param {object} errors - Errors object
 * @param {object} fieldData - Employment dates data
 */
const validateEmploymentDateRange = (errors, fieldData) => {
  const { beginningDate, endingDate } = fieldData || {};

  // Only validate if both dates are present
  if (!beginningDate || !endingDate) {
    return;
  }

  const fromDate = convertToDateField(beginningDate);
  const toDate = convertToDateField(endingDate);

  // Check if ending date is before beginning date
  if (!isValidDateRange(fromDate, toDate, true)) {
    errors.endingDate.addError(
      'Ending date must be on or after the beginning date',
    );
  }
};

/**
 * uiSchema for Employment Dates page
 * Collects employment start date and end date (optional)
 */
export const employmentDatesUiSchema = {
  ...titleUI(getPageTitle),
  employmentDates: {
    'ui:validations': [validateEmploymentDateRange],
    beginningDate: currentOrPastDateUI({
      title: 'Beginning date of employment', // Default title, will be updated by updateUiSchema
      errorMessages: {
        required: 'Beginning date of employment is required',
      },
    }),
    endingDate: MemorableDateUI({
      title: 'Ending date of employment', // Default title, will be updated by updateUiSchema
      required: false,
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      // Evaluate dynamic field titles
      const beginningDateTitle = getBeginningDateTitle(fullData || formData);
      const endingDateTitle = getEndingDateTitle(fullData || formData);

      return {
        employmentDates: {
          beginningDate: {
            'ui:title': beginningDateTitle,
          },
          endingDate: {
            'ui:title': endingDateTitle,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Employment Dates page
 * Validates employment dates fields
 */
export const employmentDatesSchema = {
  type: 'object',
  required: ['employmentDates'],
  properties: {
    employmentDates: {
      type: 'object',
      required: ['beginningDate'],
      properties: {
        beginningDate: currentOrPastDateSchema,
        endingDate: commonDefinitions.date,
      },
    },
  },
};
