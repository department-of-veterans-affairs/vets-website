import * as h from './helpers';
import { ROUTES } from '../../constants';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';

const { Q_1_1_CLAIM_DECISION } = SHORT_NAME_MAP;

// TODO add more questions to this validation check if we end up with a split
// structure in the types of radio buttons we use (with and without descriptionText)
// We'll revisit this when design comps are final
describe('Decision Reviews Onramp', () => {
  describe('Form validation', () => {
    it('displays the correct error text when no response is selected', () => {
      cy.visit(h.ROOT);

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // Q_1_1_CLAIM_DECISION -------------------------------
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.verifyFormErrorDoesNotExist(Q_1_1_CLAIM_DECISION);

      h.clickContinue();
      h.checkFormAlertText(
        Q_1_1_CLAIM_DECISION,
        'Error Placeholder error message',
      );

      h.selectRadio(Q_1_1_CLAIM_DECISION, 0);
      h.verifyFormErrorDoesNotExist(Q_1_1_CLAIM_DECISION);
      h.clickContinue();
    });
  });
});
