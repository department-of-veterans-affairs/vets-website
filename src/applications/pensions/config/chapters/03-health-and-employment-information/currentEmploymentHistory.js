import { generateEmployersSchemas, isEmployedUnder65 } from './helpers';

export default {
  title: 'Current employment',
  path: 'employment/current/history',
  depends: isEmployedUnder65,
  ...generateEmployersSchemas({
    employersKey: 'currentEmployers',
    employersTitle: 'Current employment',
    employerMessage: 'Enter all your current jobs',
    jobTypeFieldLabel: 'What kind of work do you currently do?',
    jobHoursWeekFieldLabel: 'How many hours per week do you work on average?',
    employersReviewTitle: 'Current employers',
  }),
};
