import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_3_CLAIM_CONTESTED,
  Q_2_IS_1_SERVICE_CONNECTED,
  Q_2_IS_2_CONDITION_WORSENED,
  Q_2_IS_4_DISAGREE_DECISION,
  Q_2_0_CLAIM_TYPE,
  Q_2_S_1_NEW_EVIDENCE,
} = SHORT_NAME_MAP;
const { RESULTS_2_S_1B } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended (CFI)
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - Yes
// 2.IS.2 - Yes
// 2.IS.4 - Yes
// 2.0 - Board
// 2.S.1 - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results SC (CFI, path 3)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // Q_1_1_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.selectRadio(Q_1_1_CLAIM_DECISION, 0);
      h.clickContinue();

      // Q_1_2_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_2_CLAIM_DECISION);
      h.selectRadio(Q_1_2_CLAIM_DECISION, 0);
      h.clickContinue();

      // Q_1_3_CLAIM_CONTESTED
      h.verifyUrl(ROUTES.Q_1_3_CLAIM_CONTESTED);
      h.selectRadio(Q_1_3_CLAIM_CONTESTED, 1);
      h.clickContinue();

      // Q_2_IS_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_2_IS_1_SERVICE_CONNECTED);
      h.selectRadio(Q_2_IS_1_SERVICE_CONNECTED, 0);
      h.clickContinue();

      // Q_2_IS_2_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_2_IS_2_CONDITION_WORSENED);
      h.selectRadio(Q_2_IS_2_CONDITION_WORSENED, 0);
      h.clickContinue();

      // Q_2_IS_4_DISAGREE_DECISION
      h.verifyUrl(ROUTES.Q_2_IS_4_DISAGREE_DECISION);
      h.selectRadio(Q_2_IS_4_DISAGREE_DECISION, 0);
      h.clickContinue();

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
      h.selectRadio(Q_2_0_CLAIM_TYPE, 3);
      h.clickContinue();

      // Q_2_S_1_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_S_1_NEW_EVIDENCE);
      h.selectRadio(Q_2_S_1_NEW_EVIDENCE, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_2_S_1B);
      h.checkOverviewPanel([c.TITLE_SC]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [
            c.CARD_REVIEW_BOARD,
            c.CARD_NEW_EVIDENCE,
            c.CARD_NOT_CONTESTED,
            c.CARD_SUBMITTED_BOARD_APPEAL,
          ],
        },
      ]);
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_CANNOT_SUBMIT_EVIDENCE],
        },
      ]);
      h.verifyOutsideDROptionPresent();
      cy.go('back');

      // Q_2_S_1_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_S_1_NEW_EVIDENCE);
      h.clickBack();

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
      h.clickBack();

      // Q_2_IS_4_DISAGREE_DECISION
      h.verifyUrl(ROUTES.Q_2_IS_4_DISAGREE_DECISION);
      h.clickBack();

      // Q_2_IS_2_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_2_IS_2_CONDITION_WORSENED);
      h.clickBack();

      // Q_2_IS_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_2_IS_1_SERVICE_CONNECTED);
      h.clickBack();

      // Q_1_3_CLAIM_CONTESTED
      h.verifyUrl(ROUTES.Q_1_3_CLAIM_CONTESTED);
      h.clickBack();

      // Q_1_2_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_2_CLAIM_DECISION);
      h.clickBack();

      // Q_1_1_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.clickBack();

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
    });
  });
});
