import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_2A_CONDITION_WORSENED,
  Q_1_2B_LAW_POLICY_CHANGE,
  Q_1_2C_NEW_EVIDENCE,
} = SHORT_NAME_MAP;
const { RESULTS_1_2_C1 } = RESULTS_NAME_MAP;

// Results 1.2.C1: You need to file a new claim because you have no new evidence
// and you are outside of the 1-year deadline
// 1.1 - Yes
// 1.2 - No
// 1.2A - No
// 1.2B - No
// 1.2C - No
describe('Decision Reviews Onramp', () => {
  describe('Results 1.2.C1', () => {
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
      h.selectRadio(Q_1_2B_LAW_POLICY_CHANGE, 1);
      h.clickContinue();

      // Q_1_2C_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_1_2C_NEW_EVIDENCE);
      h.selectRadio(Q_1_2C_NEW_EVIDENCE, 1);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyNonDrResultsHeader(RESULTS_1_2_C1);
      cy.go('back');

      // Q_1_2C_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_1_2C_NEW_EVIDENCE);
      h.clickBack();

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
