import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const { RESULTS_2_H_2B_1A } = RESULTS_NAME_MAP;

// Results Board Appeal: Hearing Request recommended (CFI)
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - Yes
// 2.IS.2 - Yes
// 2.IS.4 - Yes
// 2.0 - HLR
// 2.H.2 - Yes
// 2.H.2A - Yes
const path = {
  Q_1_1_CLAIM_DECISION: 0,
  Q_1_2_CLAIM_DECISION: 0,
  Q_1_3_CLAIM_CONTESTED: 1,
  Q_2_IS_1_SERVICE_CONNECTED: 0,
  Q_2_IS_2_CONDITION_WORSENED: 0,
  Q_2_IS_4_DISAGREE_DECISION: 0,
  Q_2_0_CLAIM_TYPE: 3,
  Q_2_H_2_NEW_EVIDENCE: 0,
  Q_2_H_2A_JUDGE_HEARING: 0,
};

describe('Decision Reviews Onramp', () => {
  describe('Results Board Hearing (CFI path 1)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      h.navigateToResults(path);

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS_DR);
      h.verifyDrResultsHeader(RESULTS_2_H_2B_1A);
      h.checkOverviewPanel([c.TITLE_BOARD_HEARING], true);
      h.checkGoodFitCards([
        {
          type: c.CARD_BOARD_HEARING,
          content: [
            c.CARD_GF_REVIEW_HLR,
            c.CARD_GF_YES_EVIDENCE,
            c.CARD_GF_YES_HEARING,
          ],
        },
      ]);
      h.verifyClaimForIncreaseCardPresent();
      h.checkNotGoodFitCards([
        {
          type: c.CARD_SC,
          content: [c.CARD_NGF_HEARING_NOT_INCLUDED],
        },
        {
          type: c.CARD_HLR,
          content: [
            c.CARD_NGF_HLR_NOT_AVAILABLE,
            c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE,
            c.CARD_NGF_HEARING_NOT_INCLUDED,
          ],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [
            c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE,
            c.CARD_NGF_HEARING_NOT_INCLUDED,
          ],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_NGF_HEARING_NOT_INCLUDED],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      h.navigateBackward(path);
    });
  });
});
