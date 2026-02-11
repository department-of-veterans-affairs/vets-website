/**
 *
 */

import {
  MemorableDateUI,
  MemorableDateSchema,
} from '../../21-4192-employment-information/components/memorable-date-ui';

export const examinationDateUiSchema = {
  'ui:title': 'Exam',
  dateOfExamination: MemorableDateUI('Date of examination'), // Just for testing
};

export const examinationDateSchema = {
  type: 'object',
  required: ['dateOfExamination'],
  properties: {
    dateOfExamination: MemorableDateSchema,
  },
};
