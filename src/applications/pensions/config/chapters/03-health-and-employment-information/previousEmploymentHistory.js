import generateEmployersSchemas from './employmentHistory';
import { isUnemployedUnder65 } from './helpers';

export default {
  title: 'Previous employment',
  path: 'employment/previous/history',
  depends: isUnemployedUnder65,
  ...generateEmployersSchemas(
    'previousEmployers',
    'Previous employment',
    'Enter all the previous jobs you held the last time you worked',
    'What kind of work did you do?',
    'How many hours per week did you work on average?',
    'What was your job title?',
    'Previous employers',
    4,
    true,
  ),
};
