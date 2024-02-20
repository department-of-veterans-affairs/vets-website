import { MAX_LENGTH } from '../../shared/constants';

export const issueErrorMessages = {
  missingIssue: 'Please add the name of an issue',
  maxLength: `Please enter less than ${
    MAX_LENGTH.ISSUE_NAME
  } characters for this issue name`,

  invalidDate: 'Please provide a valid date',
  blankDecisionDate: 'Please enter a decision date',
  pastDate: 'Please add a past decision date',
  newerDate: 'Please add an issue with a decision date less than a year old',
};
