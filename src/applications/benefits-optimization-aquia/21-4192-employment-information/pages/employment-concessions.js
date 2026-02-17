/**
 * @module config/form/pages/employment-concessions
 * @description Standard form system configuration for Employment Concessions page
 * VA Form 21-4192 - Request for Employment Information
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName, getEmploymentTense } from './helpers';

/**
 * Generate title for concessions field
 */
const getConcessionsTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Concessions';
  const veteranName = getVeteranName(formData);
  const tense = getEmploymentTense(formData);
  return `What concessions (if any) ${
    tense.are
  } made to ${veteranName} because of age or disability?`;
};

/**
 * uiSchema for Employment Concessions page
 * Collects information about concessions made to the employee
 */
export const employmentConcessionsUiSchema = {
  'ui:title': 'Concessions',
  employmentConcessions: {
    concessions: textareaUI({
      title: 'Concessions', // Default title, will be updated by updateUiSchema
      hint: 'Enter "None" if no concessions were made.',
      charcount: true,
      errorMessages: {
        required: 'Concessions information is required',
        maxLength: 'Concessions must be less than 1000 characters',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      // Evaluate dynamic field title
      const concessionsTitle = getConcessionsTitle(fullData || formData);

      return {
        employmentConcessions: {
          concessions: {
            'ui:title': concessionsTitle,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Employment Concessions page
 * Validates the concessions field
 */
export const employmentConcessionsSchema = {
  type: 'object',
  required: ['employmentConcessions'],
  properties: {
    employmentConcessions: {
      type: 'object',
      required: ['concessions'],
      properties: {
        concessions: {
          type: 'string',
          maxLength: 1000,
        },
      },
    },
  },
};
