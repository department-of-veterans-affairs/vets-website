/**
 * @module pages/exam-date
 * @description Standard form system configuration for Examination Date page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Examination Date page
 * Collects the date the medical examination was performed
 */
export const examinationDateUiSchema = {
  'ui:title': 'Exam',
  dateOfExamination: currentOrPastDateUI('Date of examination'),
};

/**
 * JSON Schema for Examination Date page
 * Validates the examination date field
 */
export const examinationDateSchema = {
  type: 'object',
  required: ['dateOfExamination'],
  properties: {
    dateOfExamination: currentOrPastDateSchema,
  },
};
