import { generateEmployersSchemas, isUnemployedUnder65 } from './helpers';

export default {
  title: 'List of previous employment',
  path: 'employment/previous/history',
  depends: isUnemployedUnder65,
  ...generateEmployersSchemas({
    employersKey: 'previousEmployers',
    employersTitle: 'List of previous employment',
    employerMessage:
      'Enter up to four of the previous jobs you held the last time you worked',
    jobTypeFieldLabel: 'What kind of work did you do?',
    jobHoursWeekFieldLabel: 'How many hours per week did you work on average?',
    jobTitleFieldLabel: 'What was your job title?',
    employersReviewTitle: 'Previous employers',
    maxEmployersAmount: 4,
    showJobDateField: true,
    showJobTitleField: true,
  }),
};
