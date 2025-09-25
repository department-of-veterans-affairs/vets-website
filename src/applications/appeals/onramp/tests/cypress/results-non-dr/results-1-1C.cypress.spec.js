import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';

const { RESULTS_1_1C } = RESULTS_NAME_MAP;

// Results 1.1C: You can't request a review yet
// 1.1 - No
// 1.1A - Yes
const path = { Q_1_1_CLAIM_DECISION: 1, Q_1_1A_SUBMITTED_526: 0 };

describe('Decision Reviews Onramp', () => {
  describe('Results 1.1C', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_NON_DR);
      h.verifyNonDrResultsHeader(RESULTS_1_1C);
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
