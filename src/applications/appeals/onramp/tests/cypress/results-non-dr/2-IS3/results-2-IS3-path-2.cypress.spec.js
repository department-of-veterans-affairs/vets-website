import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';
import { RESULTS_NAME_MAP } from '../../../../constants/results-data-map';

const { RESULTS_2_IS_3 } = RESULTS_NAME_MAP;

// Results 2.IS3: Condition has worsened, you may be eligible for more
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - Yes
// 2.IS.2 - Yes
// 2.IS.4 - No
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 1,
  Q_2_IS_1_SERVICE_CONNECTED: 0,
  Q_2_IS_2_CONDITION_WORSENED: 0,
  Q_2_IS_4_DISAGREE_DECISION: 1,
};

describe('Decision Reviews Onramp', () => {
  describe('Results 2.IS.3', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_NON_DR);
      h.verifyNonDrResultsHeader(RESULTS_2_IS_3);
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
