import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';

const { RESULTS_2_S_3_1 } = RESULTS_NAME_MAP;

// Results 2.S.3.1: Court of Appeals (CFI)
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - Yes
// 2.IS.2 - Yes
// 2.IS.4 - Yes
// 2.0 - Board
// 2.S.1 - No
// 2.S.2 - Yes
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 1,
  Q_2_IS_1_SERVICE_CONNECTED: 0,
  Q_2_IS_2_CONDITION_WORSENED: 0,
  Q_2_IS_4_DISAGREE_DECISION: 0,
  Q_2_0_CLAIM_TYPE: 4,
  Q_2_S_1_NEW_EVIDENCE: 1,
  Q_2_S_2_WITHIN_120_DAYS: 0,
};

describe('Decision Reviews Onramp', () => {
  describe('Results 2.S.3.1 (CFI)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_NON_DR);
      h.verifyNonDrResultsHeader(RESULTS_2_S_3_1);
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
