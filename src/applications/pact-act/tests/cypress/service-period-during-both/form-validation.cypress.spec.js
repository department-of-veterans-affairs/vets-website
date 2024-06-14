import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('During both of these time periods - form validation', () => {
    it('displays the correct error text when no response is selected', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD -------------------------------
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.verifyFormErrorNotShown(h.SERVICE_PERIOD_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.SERVICE_PERIOD_INPUT, 'Error Select a response.');

      h.selectRadio(h.SERVICE_PERIOD_INPUT, 2);
      h.verifyFormErrorNotShown(h.SERVICE_PERIOD_INPUT);
      h.clickContinue();

      // BURN_PIT_2_1 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.BURN_PIT_2_1_INPUT, 'Error Select a response.');

      h.selectRadio(h.BURN_PIT_2_1_INPUT, 2);
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_INPUT);
      h.clickContinue();

      // BURN_PIT_2_1_1 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_1_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.BURN_PIT_2_1_1_INPUT, 'Error Select a response.');

      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 2);
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_1_INPUT);
      h.clickContinue();

      // BURN_PIT_2_1_2 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_2_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.BURN_PIT_2_1_2_INPUT, 'Error Select a response.');

      h.selectRadio(h.BURN_PIT_2_1_2_INPUT, 2);
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_2_INPUT);
      h.clickContinue();

      // ORANGE_2_2_A --------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_A_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.ORANGE_2_2_A_INPUT, 'Error Select a response.');

      h.selectRadio(h.ORANGE_2_2_A_INPUT, 0);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_A_INPUT);
      h.clickContinue();

      // ORANGE_2_2_B --------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_B);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_B_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.ORANGE_2_2_B_INPUT, 'ErrorSelect a location.');

      h.selectCheckbox(h.ORANGE_2_2_B_INPUT, 0);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_B_INPUT);
      h.clickBack();

      // ORANGE_2_2_A --------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_A_INPUT);
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_1_A ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_1_A_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.ORANGE_2_2_1_A_INPUT, 'Error Select a response.');

      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 0);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_1_A_INPUT);
      h.clickContinue();

      // ORANGE_2_2_1_B -----------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_1_B);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_1_B_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.ORANGE_2_2_1_B_INPUT, 'ErrorSelect a location.');

      h.selectCheckbox(h.ORANGE_2_2_1_B_INPUT, 0);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_1_B_INPUT);
      h.clickBack();

      // ORANGE_2_2_1_A ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_1_A_INPUT);
      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_2 ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_2);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_2_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.ORANGE_2_2_2_INPUT, 'Error Select a response.');

      h.selectRadio(h.ORANGE_2_2_2_INPUT, 2);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_2_INPUT);
      h.clickContinue();

      // ORANGE_2_2_3 ------------------------------
      h.verifyUrl(ROUTES.ORANGE_2_2_3);
      h.verifyFormErrorNotShown(h.ORANGE_2_2_3_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.ORANGE_2_2_3_INPUT, 'Error Select a response.');

      h.selectRadio(h.ORANGE_2_2_3_INPUT, 2);
      h.clickContinue();

      // RADIATION_2_3_A ------------------------------
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.verifyFormErrorNotShown(h.RADIATION_2_3_A_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.RADIATION_2_3_A_INPUT, 'Error Select a response.');

      h.selectRadio(h.RADIATION_2_3_A_INPUT, 0);
      h.clickContinue();

      // RADIATION_2_3_B -----------------------------
      h.verifyUrl(ROUTES.RADIATION_2_3_B);
      h.verifyFormErrorNotShown(h.RADIATION_2_3_B_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.RADIATION_2_3_B_INPUT, 'ErrorSelect a location.');

      h.selectCheckbox(h.RADIATION_2_3_B_INPUT, 0);
      h.verifyFormErrorNotShown(h.RADIATION_2_3_B_INPUT);
      h.clickBack();

      // RADIATION_2_3_A ------------------------------
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.verifyFormErrorNotShown(h.RADIATION_2_3_A_INPUT);
      h.selectRadio(h.RADIATION_2_3_A_INPUT, 2);
      h.clickContinue();

      // LEJEUNE_2_4 ------------------------------
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.verifyFormErrorNotShown(h.LEJEUNE_2_4_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.LEJEUNE_2_4_INPUT, 'Error Select a response.');

      h.selectRadio(h.LEJEUNE_2_4_INPUT, 0);
      h.clickContinue();
    });
  });
});
