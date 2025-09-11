import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';
import { SHORT_NAME_MAP } from '../../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../../constants/results-data-map';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_3_CLAIM_CONTESTED,
  Q_2_0_CLAIM_TYPE,
  Q_2_IS_1_SERVICE_CONNECTED,
  Q_2_IS_2_CONDITION_WORSENED,
} = SHORT_NAME_MAP;
const { RESULTS_2_IS_3 } = RESULTS_NAME_MAP;

// Results 2.IS3: Condition has worsened, you may be eligible for more
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.0 - Supplemental
// 2.IS.1 - Yes
// 2.IS.2 - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results 2.IS3', () => {
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
      h.selectRadio(Q_2_IS_1_SERVICE_CONNECTED, 0);
      h.clickContinue();

      // Q_2_IS_2_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_2_IS_2_CONDITION_WORSENED);
      h.selectRadio(Q_2_IS_2_CONDITION_WORSENED, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyNonDrResultsHeader(RESULTS_2_IS_3);
      cy.go('back');

      // Q_2_IS_2_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_2_IS_2_CONDITION_WORSENED);
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
