import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('During both of these time periods - form validation', () => {
    it('displays the correct error text when no answer is selected', () => {
      cy.visit('/pact-act-wizard-test');

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD -------------------------------
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.verifyElement(h.SERVICE_PERIOD_INPUT);
      cy.injectAxeThenAxeCheck();
      h.verifyFormErrorNotShown(h.SERVICE_PERIOD_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.SERVICE_PERIOD_INPUT, 'Error TBD error message');

      h.selectRadio(h.SERVICE_PERIOD_INPUT, 2);
      h.verifyFormErrorNotShown(h.SERVICE_PERIOD_INPUT);
      h.clickContinue();

      // BURN_PIT_2_1 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.verifyElement(h.BURN_PIT_2_1_INPUT);
      cy.injectAxeThenAxeCheck();
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.BURN_PIT_2_1_INPUT, 'Error TBD error message');

      h.selectRadio(h.BURN_PIT_2_1_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1_1 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.verifyElement(h.BURN_PIT_2_1_1_INPUT);
      cy.injectAxeThenAxeCheck();
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_1_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.BURN_PIT_2_1_1_INPUT, 'Error TBD error message');

      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1_2 --------------------------------
      h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
      h.verifyElement(h.BURN_PIT_2_1_2_INPUT);
      cy.injectAxeThenAxeCheck();
      h.verifyFormErrorNotShown(h.BURN_PIT_2_1_2_INPUT);

      h.clickContinue();
      h.checkFormAlertText(h.BURN_PIT_2_1_2_INPUT, 'Error TBD error message');

      h.selectRadio(h.BURN_PIT_2_1_2_INPUT, 2);
      h.clickContinue();

      // TODO: test navigation to Results screen 1 when that mapping logic exists
      // Results screen 1
    });
  });
});
