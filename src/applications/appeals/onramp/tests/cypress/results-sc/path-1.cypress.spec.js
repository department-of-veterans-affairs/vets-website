import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_2A_1_SERVICE_CONNECTED,
  Q_1_2B_LAW_POLICY_CHANGE,
} = SHORT_NAME_MAP;
const { RESULTS_2_S_1A } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended (Non-CFI)
// 1.1 - Yes
// 1.2 - No
// 1.2A.1 - No
// 1.2B - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 1)', () => {
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
      h.selectRadio(Q_1_2A_1_SERVICE_CONNECTED, 1);
      h.clickContinue();

      // Q_1_2B_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_1_2B_LAW_POLICY_CHANGE);
      h.selectRadio(Q_1_2B_LAW_POLICY_CHANGE, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_2_S_1A);
      h.checkOverviewPanel([c.TITLE_SC]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [c.CARD_GF_YES_LAW_POLICY],
        },
      ]);
      h.verifyClaimForIncreaseCardNotPresent();
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

      // Q_1_2B_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_1_2B_LAW_POLICY_CHANGE);
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
