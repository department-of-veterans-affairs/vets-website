import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const { RESULTS_2_S_1A } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended (Non-CFI)
// 1.1 - Yes
// 1.2 - No
// 1.2A.1 - No
// 1.2B - No
// 1.2C - Yes
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 1,
  Q_1_2A_1_SERVICE_CONNECTED: 1,
  Q_1_2B_LAW_POLICY_CHANGE: 1,
  Q_1_2C_NEW_EVIDENCE: 0,
};

describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 2)', () => {
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
          content: [c.CARD_GF_YES_EVIDENCE],
        },
      ]);
      h.verifyClaimForIncreaseCardNotPresent();
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [
            c.CARD_NGF_DECISION_OVER_1_YEAR,
            c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE,
          ],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [
            c.CARD_NGF_DECISION_OVER_1_YEAR,
            c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE,
          ],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_NGF_DECISION_OVER_1_YEAR],
        },
        {
          type: c.CARD_BOARD_HEARING,
          content: [c.CARD_NGF_DECISION_OVER_1_YEAR],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
