/**
 * @module config/form/pages/employment-termination
 * @description Standard form system configuration for Employment Termination page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  textareaUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName, formatDate } from './helpers';

/**
 * Generate page description
 */
const getPageDescription = formData => {
  // Defensive: getVeteranName handles formData validation
  const veteranName = getVeteranName(formData);

  // Defensive: Check formData before accessing nested properties
  const endingDate =
    formData && typeof formData === 'object' && !Array.isArray(formData)
      ? formData.employmentDates?.endingDate || ''
      : '';

  const formattedEndDate = formatDate(endingDate);

  if (formattedEndDate) {
    return `On a previous page, you indicated that ${veteranName} stopped working on ${formattedEndDate}. Why did they stop working?`;
  }

  return `On a previous page, you indicated that ${veteranName} stopped working. Why did they stop working?`;
};

/**
 * uiSchema for Employment Termination page
 * Collects information about employment termination
 */
export const employmentTerminationUiSchema = {
  'ui:title': 'Termination of employment',
  'ui:description': getPageDescription,
  employmentTermination: {
    terminationReason: textareaUI({
      title: 'Reason for termination of employment',
      hint: 'If they retired on disability, please specify.',
      charcount: true,
      errorMessages: {
        maxLength: 'Termination reason must be less than 1000 characters',
      },
    }),
    dateLastWorked: currentOrPastDateUI({
      title: 'Date last worked',
      errorMessages: {
        required: 'Date last worked is required',
      },
    }),
  },
};

/**
 * JSON Schema for Employment Termination page
 * Validates termination reason and date last worked fields
 */
export const employmentTerminationSchema = {
  type: 'object',
  required: ['employmentTermination'],
  properties: {
    employmentTermination: {
      type: 'object',
      required: ['dateLastWorked'],
      properties: {
        terminationReason: {
          type: 'string',
          maxLength: 1000,
        },
        dateLastWorked: currentOrPastDateSchema,
      },
    },
  },
};
