import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';

const { RESULTS_1_3B } = RESULTS_NAME_MAP;

// Results 1.3B: Contested claims, more than 60 days after decision
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - Yes
// 1.3A - No
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 0,
  Q_1_3A_FEWER_60_DAYS: 1,
};

describe('Decision Reviews Onramp', () => {
  describe('Results 1.3B', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_NON_DR);
      h.verifyNonDrResultsHeader(RESULTS_1_3B);
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
