import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_3_CLAIM_CONTESTED,
  Q_2_0_CLAIM_TYPE,
  Q_2_IS_1_SERVICE_CONNECTED,
  Q_2_IS_1A_LAW_POLICY_CHANGE,
  Q_2_IS_1B_NEW_EVIDENCE,
} = SHORT_NAME_MAP;
const { RESULTS_SC } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.0 - Supplemental
// 2.IS.1 - No
// 2.IS.1A - No
// 2.IS.1B - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 4)', () => {
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

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
      h.selectRadio(Q_2_0_CLAIM_TYPE, 1);
      h.clickContinue();

      // Q_2_IS_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_2_IS_1_SERVICE_CONNECTED);
      h.selectRadio(Q_2_IS_1_SERVICE_CONNECTED, 1);
      h.clickContinue();

      // Q_2_IS_1A_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_2_IS_1A_LAW_POLICY_CHANGE);
      h.selectRadio(Q_2_IS_1A_LAW_POLICY_CHANGE, 1);
      h.clickContinue();

      // Q_2_IS_1B_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_IS_1B_NEW_EVIDENCE);
      h.selectRadio(Q_2_IS_1B_NEW_EVIDENCE, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_SC);
      h.checkOverviewPanel([c.TITLE_SC, c.TITLE_BOARD_EVIDENCE]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [
            c.CARD_REVIEW_SC,
            c.CARD_NEW_EVIDENCE,
            c.CARD_NOT_CONTESTED,
          ],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_REVIEW_SC, c.CARD_NEW_EVIDENCE],
        },
      ]);
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_CANNOT_SUBMIT_EVIDENCE],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      // Q_2_IS_1B_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_IS_1B_NEW_EVIDENCE);
      h.clickBack();

      // Q_2_IS_1A_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_2_IS_1A_LAW_POLICY_CHANGE);
      h.clickBack();

      // Q_2_IS_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_2_IS_1_SERVICE_CONNECTED);
      h.clickBack();

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
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
