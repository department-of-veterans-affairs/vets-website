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
} = SHORT_NAME_MAP;
const { RESULTS_SC } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.0 - Initial
// 2.IS.1 - No
// 2.IS.1A - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 3)', () => {
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
      h.selectRadio(Q_2_0_CLAIM_TYPE, 0);
      h.clickContinue();

      // Q_2_IS_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_2_IS_1_SERVICE_CONNECTED);
      h.selectRadio(Q_2_IS_1_SERVICE_CONNECTED, 1);
      h.clickContinue();

      // Q_2_IS_1A_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_2_IS_1A_LAW_POLICY_CHANGE);
      h.selectRadio(Q_2_IS_1A_LAW_POLICY_CHANGE, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_SC);
      h.verifyOverviewPanelItemCount(1);
      h.verifyOverviewPanelItems(0, c.TITLE_SC);
      h.verifyGoodFitCardCount(1);
      h.verifyGoodFitCardPresent(c.CARD_SC);
      h.verifyNotGoodFitCardsNotPresent();
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

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
