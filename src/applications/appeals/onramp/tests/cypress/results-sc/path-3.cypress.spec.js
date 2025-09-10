import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_2A_1_SERVICE_CONNECTED,
  Q_1_2A_CONDITION_WORSENED,
  Q_1_2A_2_DISAGREE_DECISION,
} = SHORT_NAME_MAP;
const { RESULTS_2_S_1A } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended (Non-CFI)
// 1.1 - Yes
// 1.2 - No
// 1.2A.1 - Yes
// 1.2A - Yes
// 1.2A.2 - Yes
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
      h.selectRadio(Q_1_2_CLAIM_DECISION, 1);
      h.clickContinue();

      // Q_1_2A_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_1_2A_1_SERVICE_CONNECTED);
      h.selectRadio(Q_1_2A_1_SERVICE_CONNECTED, 0);
      h.clickContinue();

      // Q_1_2A_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_1_2A_CONDITION_WORSENED);
      h.selectRadio(Q_1_2A_CONDITION_WORSENED, 0);
      h.clickContinue();

      // Q_1_2A_2_DISAGREE_DECISION
      h.verifyUrl(ROUTES.Q_1_2A_2_DISAGREE_DECISION);
      h.selectRadio(Q_1_2A_2_DISAGREE_DECISION, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_2_S_1A);
      h.checkOverviewPanel([c.TITLE_SC]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [c.CARD_SUBMITTED_BOARD_APPEAL],
        },
      ]);
      h.verifyNotGoodFitCardsNotPresent();
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      // Q_1_2A_2_DISAGREE_DECISION
      h.verifyUrl(ROUTES.Q_1_2A_2_DISAGREE_DECISION);
      h.clickBack();

      // Q_1_2A_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_1_2A_CONDITION_WORSENED);
      h.clickBack();

      // Q_1_2A_1_SERVICE_CONNECTED
      h.verifyUrl(ROUTES.Q_1_2A_1_SERVICE_CONNECTED);
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
