import { generateEmployersSchemas, isEmployedUnder65 } from './helpers';

export default {
  title: 'List of current employment',
  path: 'employment/current/history',
  depends: isEmployedUnder65,
  ...generateEmployersSchemas({
    employersKey: 'currentEmployers',
<<<<<<< pension-29946-update-list-titles
    employersTitle: 'List of current employment',
    employerMessage: 'Enter all your current jobs',
=======
    employersTitle: 'Current employment',
    employerMessage: 'Enter up to two of your current jobs',
>>>>>>> main
    jobTypeFieldLabel: 'What kind of work do you currently do?',
    jobHoursWeekFieldLabel: 'How many hours per week do you work on average?',
    employersReviewTitle: 'Current employers',
  }),
};
