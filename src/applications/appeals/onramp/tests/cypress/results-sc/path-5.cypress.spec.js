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
// 2.0 - Initial
// 2.IS.1A - No
// 2.IS.1B - Yes
// 2.IS.1B.3 - No
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 1,
  Q_2_IS_1_SERVICE_CONNECTED: 0,
  Q_2_IS_2_CONDITION_WORSENED: 1,
  Q_2_0_CLAIM_TYPE: 0,
  Q_2_IS_1A_LAW_POLICY_CHANGE: 1,
  Q_2_IS_1B_NEW_EVIDENCE: 0,
  Q_2_IS_1B_3_JUDGE_HEARING: 1,
};

describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 5)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_DR);
      h.verifyDrResultsHeader(RESULTS_2_S_1A);
      h.checkOverviewPanel([
        c.TITLE_SC,
        c.TITLE_BOARD_EVIDENCE,
        c.TITLE_BOARD_HEARING,
      ]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [
            c.CARD_GF_REVIEW_INIT,
            c.CARD_GF_YES_EVIDENCE,
            c.CARD_GF_NOT_CONTESTED,
          ],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [
            c.CARD_GF_REVIEW_INIT,
            c.CARD_GF_YES_EVIDENCE,
            c.CARD_GF_NO_LAW_POLICY,
          ],
        },
        {
          type: c.CARD_BOARD_HEARING,
          content: [
            c.CARD_GF_REVIEW_INIT,
            c.CARD_GF_YES_EVIDENCE,
            c.CARD_GF_NO_LAW_POLICY,
          ],
        },
      ]);
      h.verifyClaimForIncreaseCardNotPresent();
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
