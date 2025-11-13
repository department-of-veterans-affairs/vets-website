import {
  generateEmployersSchemas,
  isEmployedUnder65,
  requiresEmploymentHistory,
} from './helpers';
import {
  showMultiplePageResponse,
  showPdfFormAlignment,
} from '../../../helpers';

export default {
  title: 'List of current employment',
  path: 'employment/current/history',
  depends: formData => {
    if (!showMultiplePageResponse()) {
      return showPdfFormAlignment()
        ? formData.currentEmployment === true &&
            requiresEmploymentHistory(formData)
        : isEmployedUnder65(formData);
    }
    return false;
  },
  ...generateEmployersSchemas({
    employersKey: 'currentEmployers',
    employersTitle: 'List of current employment',
    employerMessage: 'Enter up to two of your current jobs',
    jobTypeFieldLabel: 'What kind of work do you currently do?',
    jobHoursWeekFieldLabel: 'How many hours per week do you work on average?',
    employersReviewTitle: 'Current employers',
  }),
};
