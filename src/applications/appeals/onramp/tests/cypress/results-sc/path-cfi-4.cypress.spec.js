import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const { RESULTS_2_S_1B } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended (CFI)
// 1.1 - Yes
// 1.2 - No
// 1.2A.1 - Yes
// 1.2A - Yes
// 1.2A.2 - Yes
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 1,
  Q_1_2A_1_SERVICE_CONNECTED: 0,
  Q_1_2A_CONDITION_WORSENED: 0,
  Q_1_2A_2_DISAGREE_DECISION: 0,
};

describe('Decision Reviews Onramp', () => {
  describe('Results SC (CFI, path 4)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_DR);
      h.verifyDrResultsHeader(RESULTS_2_S_1B);
      h.checkOverviewPanel([c.TITLE_SC]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [c.CARD_GF_DECISION_OVER_1_YEAR],
        },
      ]);
      h.verifyClaimForIncreaseCardPresent();
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_NGF_DECISION_OVER_1_YEAR],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [c.CARD_NGF_DECISION_OVER_1_YEAR],
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
