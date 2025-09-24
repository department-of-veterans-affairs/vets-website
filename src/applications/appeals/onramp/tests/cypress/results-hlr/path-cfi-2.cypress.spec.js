import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const { RESULTS_2_IS_1D } = RESULTS_NAME_MAP;

// Results HLR: Higher-Level Review recommended (CFI)
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - Yes
// 2.IS.2 - Yes
// 2.IS.4 - Yes
// 2.0 - Initial
// 2.IS.1A - No
// 2.IS.1B - No
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 1,
  Q_2_IS_1_SERVICE_CONNECTED: 0,
  Q_2_IS_2_CONDITION_WORSENED: 0,
  Q_2_IS_4_DISAGREE_DECISION: 0,
  Q_2_0_CLAIM_TYPE: 0,
  Q_2_IS_1A_LAW_POLICY_CHANGE: 1,
  Q_2_IS_1B_NEW_EVIDENCE: 1,
};

describe('Decision Reviews Onramp', () => {
  describe('Results HLR (CFI, path 2)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_2_IS_1D);
      h.checkOverviewPanel(
        [c.TITLE_HLR, c.TITLE_BOARD_DIRECT, c.TITLE_BOARD_HEARING],
        true,
      );
      h.checkGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [
            c.CARD_GF_REVIEW_INIT,
            c.CARD_GF_NO_EVIDENCE,
            c.CARD_GF_NOT_CONTESTED,
            c.CARD_GF_NO_LAW_POLICY,
          ],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [c.CARD_GF_REVIEW_INIT, c.CARD_GF_NO_EVIDENCE],
        },
        {
          type: c.CARD_BOARD_HEARING,
          content: [c.CARD_GF_REVIEW_INIT, c.CARD_GF_NO_EVIDENCE],
        },
      ]);
      h.verifyClaimForIncreaseCardPresent();
      h.checkNotGoodFitCards([
        {
          type: c.CARD_SC,
          content: [c.CARD_NGF_NEED_EVIDENCE, c.CARD_NGF_NO_LAW_POLICY],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_NGF_NEED_EVIDENCE],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
