import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_2A_CONDITION_WORSENED,
  Q_1_2B_LAW_POLICY_CHANGE,
} = SHORT_NAME_MAP;
const { RESULTS_SC } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended
// 1.1 - Yes
// 1.2 - No
// 1.2A - No
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

      // Q_1_2A_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_1_2A_CONDITION_WORSENED);
      h.selectRadio(Q_1_2A_CONDITION_WORSENED, 1);
      h.clickContinue();

      // Q_1_2B_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_1_2B_LAW_POLICY_CHANGE);
      h.selectRadio(Q_1_2B_LAW_POLICY_CHANGE, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyText(h.RESULTS_HEADER, RESULTS_SC);
      cy.go('back');

      // Q_1_2B_LAW_POLICY_CHANGE
      h.verifyUrl(ROUTES.Q_1_2B_LAW_POLICY_CHANGE);
      h.clickBack();

      // Q_1_2A_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_1_2A_CONDITION_WORSENED);
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
