import { RESPONSES } from './question-data-map';

// Display conditions are:
// --> SHORT_NAME for a question (A)
// set equal to:
// --> list of SHORT_NAMEs for other questions in the flow
// that affect whether (A) should display
//
// This is used when navigating forward and backward in the flow
//
// Example:
// QUESTION_3: {
//   QUESTION_2: QUESTION_2 response(s) required to show QUESTION_3
//   QUESTION_1: QUESTION_1 response(s) required to show QUESTION_3
// }
export const DISPLAY_CONDITIONS = {
  SERVICE_PERIOD: {},
  BURN_PIT_210: {
    SERVICE_PERIOD: [RESPONSES.NINETY_OR_LATER, RESPONSES.DURING_BOTH_PERIODS],
  },
};
