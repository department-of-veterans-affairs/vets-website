import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const { RESULTS_2_S_1A } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended (Non-CFI)
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - Yes
// 2.IS.2 - No
// 2.0 - Claim for Increase
// 2.IS.1A - Yes
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 1,
  Q_2_IS_1_SERVICE_CONNECTED: 0,
  Q_2_IS_2_CONDITION_WORSENED: 1,
  Q_2_0_CLAIM_TYPE: 1,
  Q_2_IS_1A_LAW_POLICY_CHANGE: 0,
};

describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 8)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_DR);
      h.verifyDrResultsHeader(RESULTS_2_S_1A);
      h.checkOverviewPanel([c.TITLE_SC]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [
            c.CARD_GF_REVIEW_INIT,
            c.CARD_GF_YES_LAW_POLICY,
            c.CARD_GF_NOT_CONTESTED,
          ],
        },
      ]);
      h.verifyClaimForIncreaseCardNotPresent();
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_NGF_YES_LAW_POLICY],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [c.CARD_NGF_YES_LAW_POLICY],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_NGF_YES_LAW_POLICY],
        },
        {
          type: c.CARD_BOARD_HEARING,
          content: [c.CARD_NGF_YES_LAW_POLICY],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
