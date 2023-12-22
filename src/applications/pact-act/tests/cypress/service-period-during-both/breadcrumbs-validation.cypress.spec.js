import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { QUESTION_MAP } from '../../../constants/question-data-map';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('During both of these time periods - breadcrumbs validation', () => {
    it('displays the correct breadcrumb for each page', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.verifyTextWithoutSelector(QUESTION_MAP.HOME);
      h.clickStart();

      // SERVICE_PERIOD -------------------------------
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.verifyTextWithoutSelector(QUESTION_MAP.SERVICE_PERIOD);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.SERVICE_PERIOD_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.verifyTextWithoutSelector(QUESTION_MAP.BURN_PIT_2_1);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.BURN_PIT_2_1_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1_1 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.verifyTextWithoutSelector(QUESTION_MAP.BURN_PIT_2_1_1);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1_2 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
      h.verifyTextWithoutSelector(QUESTION_MAP.BURN_PIT_2_1_2);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.BURN_PIT_2_1_2_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_A --------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_A);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.ORANGE_2_2_A_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_B --------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_B);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_B);
      cy.injectAxeThenAxeCheck();

      h.selectCheckbox(h.ORANGE_2_2_B_INPUT, 0);
      h.clickBack();

      // ORANGE_2_2_A --------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_A);
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_1_A ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_1_A);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_1_B -----------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_1_B);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_1_B);
      cy.injectAxeThenAxeCheck();

      h.selectCheckbox(h.ORANGE_2_2_1_B_INPUT, 0);
      h.clickBack();

      // ORANGE_2_2_1_A ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_1_A);
      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_2 ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_2);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_2);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.ORANGE_2_2_2_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_3 ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_3);
      h.verifyTextWithoutSelector(QUESTION_MAP.ORANGE_2_2_3);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.ORANGE_2_2_3_INPUT, 2);
      h.clickContinue();

      // RADIATION_2_3_A ------------------------------
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.verifyTextWithoutSelector(QUESTION_MAP.RADIATION_2_3_A);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.RADIATION_2_3_A_INPUT, 0);
      h.clickContinue();

      // RADIATION_2_3_B -----------------------------
      h.verifyUrl(ROUTES.RADIATION_2_3_B);
      h.verifyTextWithoutSelector(QUESTION_MAP.RADIATION_2_3_B);
      cy.injectAxeThenAxeCheck();

      h.selectCheckbox(h.RADIATION_2_3_B_INPUT, 0);
      h.clickBack();

      // RADIATION_2_3_A ------------------------------
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.verifyTextWithoutSelector(QUESTION_MAP.RADIATION_2_3_A);
      h.selectRadio(h.RADIATION_2_3_A_INPUT, 2);
      h.clickContinue();

      // LEJEUNE_2_4 ------------------------------
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.verifyTextWithoutSelector(QUESTION_MAP.LEJEUNE_2_4);
      cy.injectAxeThenAxeCheck();

      h.selectRadio(h.LEJEUNE_2_4_INPUT, 0);
      h.clickContinue();
    });
  });
});
