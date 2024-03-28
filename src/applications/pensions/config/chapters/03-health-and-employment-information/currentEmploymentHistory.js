import generateEmployersSchemas from './employmentHistory';
import { isEmployedUnder65 } from './helpers';

export default {
  title: 'Current employment',
  path: 'employment/current/history',
  depends: isEmployedUnder65,
  ...generateEmployersSchemas(
    'currentEmployers',
    'Current employment',
    'Enter all your current jobs',
    'What kind of work do you currently do?',
    'How many hours per week do you work on average?',
    'Job title',
    'Current employers',
  ),
};
