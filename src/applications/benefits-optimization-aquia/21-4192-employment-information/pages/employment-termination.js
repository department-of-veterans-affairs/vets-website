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

/**
 * uiSchema for Employment Termination page
 * Collects information about employment termination
 */
export const employmentTerminationUiSchema = {
  'ui:title': 'Termination of employment',
  employmentTermination: {
    terminationReason: textareaUI({
      title: 'Reason for termination of employment',
      hint:
        'If they retired on disability, please specify the disability(ies).',
      charcount: true,
      errorMessages: {
        required: 'Reason for termination is required',
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
      required: ['terminationReason', 'dateLastWorked'],
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
