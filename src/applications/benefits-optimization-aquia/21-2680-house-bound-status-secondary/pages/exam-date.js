/**
 * @module pages/exam-date
 * @description Standard form system configuration for Examination Date page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

import {
  MemorableDateUI,
  MemorableDateSchema,
} from '../../21-4192-employment-information/components/memorable-date-ui';

/**
 * uiSchema for Examination Date page
 * Collects the date the medical examination was performed
 */
export const examinationDateUiSchema = {
  'ui:title': 'Exam',
  dateOfExamination: MemorableDateUI('Date of examination'),
};

/**
 * JSON Schema for Examination Date page
 * Validates the examination date field
 */
export const examinationDateSchema = {
  type: 'object',
  required: ['dateOfExamination'],
  properties: {
    dateOfExamination: MemorableDateSchema,
  },
};
