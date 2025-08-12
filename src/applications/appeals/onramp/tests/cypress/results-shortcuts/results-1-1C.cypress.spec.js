import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';

const { Q_1_1_CLAIM_DECISION, Q_1_1A_SUBMITTED_526 } = SHORT_NAME_MAP;

// Results 1.1C: You can't request a review yet
// 1.1 - No
// 1.1A - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results 1.1C', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // Q_1_1_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.selectRadio(Q_1_1_CLAIM_DECISION, 1);
      h.clickContinue();

      // Q_1_1A_SUBMITTED_526
      h.verifyUrl(ROUTES.Q_1_1A_SUBMITTED_526);
      h.selectRadio(Q_1_1A_SUBMITTED_526, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyNonDrResultsHeader();
      cy.go('back');

      // Q_1_1A_SUBMITTED_526
      h.verifyUrl(ROUTES.Q_1_1A_SUBMITTED_526);
      h.clickBack();

      // Q_1_1_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.clickBack();

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
    });
  });
});
