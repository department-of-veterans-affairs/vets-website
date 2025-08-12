import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_2A_CONDITION_WORSENED,
} = SHORT_NAME_MAP;

// Results 2.IS3: Condition has worsened, you may be eligible for more
// 1.1 - Yes
// 1.2 - No
// 1.2A - Yes
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
      h.selectRadio(Q_1_2_CLAIM_DECISION, 1);
      h.clickContinue();

      // Q_1_2A_CONDITION_WORSENED
      h.verifyUrl(ROUTES.Q_1_2A_CONDITION_WORSENED);
      h.selectRadio(Q_1_2A_CONDITION_WORSENED, 0);
      h.clickContinue();

      // TODO - Add results page check here

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
