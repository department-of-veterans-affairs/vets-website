/**
 * @module config/form/pages/employment-dates
 * @description Standard form system configuration for Employment Dates page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  checkboxUI,
  checkboxSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName, getEmployerName } from './helpers';

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
 * Generate title for currently employed field
 */
const getCurrentlyEmployedTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Currently employed';
  const veteranName = getVeteranName(formData);
  const employerName = getEmployerName(formData);
  return `${veteranName} is currently employed at ${employerName}.`;
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
 * uiSchema for Employment Dates page
 * Collects employment start date, end date, and current employment status
 */
export const employmentDatesUiSchema = {
  ...titleUI(getPageTitle),
  employmentDates: {
    beginningDate: currentOrPastDateUI({
      title: 'Beginning date of employment', // Default title, will be updated by updateUiSchema
      errorMessages: {
        required: 'Beginning date of employment is required',
      },
    }),
    currentlyEmployed: checkboxUI({
      title: 'Currently employed', // Default title, will be updated by updateUiSchema
    }),
    endingDate: currentOrPastDateUI({
      title: 'Ending date of employment', // Default title, will be updated by updateUiSchema
      errorMessages: {
        required: 'Ending date of employment is required',
      },
      expandUnder: 'currentlyEmployed',
      expandUnderCondition: value => !value,
      required: formData => !formData?.employmentDates?.currentlyEmployed,
    }),
  },
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      const currentlyEmployed = formData?.employmentDates?.currentlyEmployed;
      const requiredFields = currentlyEmployed
        ? ['beginningDate']
        : ['beginningDate', 'endingDate'];

      return {
        ...formSchema,
        properties: {
          ...formSchema.properties,
          employmentDates: {
            ...formSchema.properties.employmentDates,
            required: requiredFields,
          },
        },
      };
    },
    updateUiSchema: (formData, fullData) => {
      // Evaluate dynamic field titles
      const beginningDateTitle = getBeginningDateTitle(fullData || formData);
      const currentlyEmployedTitle = getCurrentlyEmployedTitle(
        fullData || formData,
      );
      const endingDateTitle = getEndingDateTitle(fullData || formData);

      return {
        employmentDates: {
          beginningDate: {
            'ui:title': beginningDateTitle,
          },
          currentlyEmployed: {
            'ui:title': currentlyEmployedTitle,
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
        currentlyEmployed: checkboxSchema,
        endingDate: currentOrPastDateSchema,
      },
    },
  },
};
