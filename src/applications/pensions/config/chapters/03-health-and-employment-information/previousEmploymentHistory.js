import { generateEmployersSchemas, isUnemployedUnder65 } from './helpers';

export default {
  title: 'Previous employment',
  path: 'employment/previous/history',
  depends: isUnemployedUnder65,
  ...generateEmployersSchemas({
    employersKey: 'previousEmployers',
    employersTitle: 'Previous employment',
    employerMessage:
      'Enter all the previous jobs you held the last time you worked',
    jobTypeFieldLabel: 'What kind of work did you do?',
    jobHoursWeekFieldLabel: 'How many hours per week did you work on average?',
    jobTitleFieldLabel: 'What was your job title?',
    employersReviewTitle: 'Previous employers',
    maxEmployersAmount: 4,
    showJobDateField: true,
    showJobTitleField: true,
  }),
};
