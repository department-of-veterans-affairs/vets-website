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
const { RESULTS_2_IS_1C } = RESULTS_NAME_MAP;

// Results HLR: Higher-Level Review recommended (Non-CFI)
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.IS.1 - No
// 2.0 - Initial
// 2.IS.1A - No
// 2.IS.1B - No
describe('Decision Reviews Onramp', () => {
  describe('Results HLR (path 1)', () => {
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
      h.selectRadio(Q_2_IS_1_SERVICE_CONNECTED, 1);
      h.clickContinue();

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
      h.selectRadio(Q_2_0_CLAIM_TYPE, 0);
      h.clickContinue();

      // Q_2_IS_1A_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_2_IS_1A_LAW_POLICY_CHANGE);
      h.selectRadio(Q_2_IS_1A_LAW_POLICY_CHANGE, 1);
      h.clickContinue();

      // Q_2_IS_1B_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_IS_1B_NEW_EVIDENCE);
      h.selectRadio(Q_2_IS_1B_NEW_EVIDENCE, 1);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_2_IS_1C);
      h.checkOverviewPanel([
        c.TITLE_HLR,
        c.TITLE_BOARD_DIRECT,
        c.TITLE_BOARD_HEARING,
      ]);
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
      ]);
      h.checkNotGoodFitCards([
        {
          type: c.CARD_SC,
          content: [c.CARD_NGF_NEED_EVIDENCE],
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

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
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
