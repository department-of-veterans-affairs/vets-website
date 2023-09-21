import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow A
// Service Period - 1989 or earlier
// Agent Orange 2.2.A - Yes
// Agent Orange 2.2.B - Select 1 checkbox
// Radiation 2.3.A - Yes
// Radiation 2.3.B - Select 1 checkbox
// Camp Lejeune 2.4 - Yes
// Results 1

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
xdescribe('PACT Act', () => {
  describe('1989 or earlier - "Yes" to ORANGE_2_2_A - "Yes" to two or more categories (Results Screen 1)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit('/pact-act-wizard-test');

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.selectRadio(h.SERVICE_PERIOD_INPUT, 1);
      h.clickContinue();

      // ORANGE_2_2_A
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_B
      h.verifyUrl(ROUTES.ORANGE_2_2_B);
      h.selectCheckbox(h.ORANGE_2_2_B_INPUT, 0);
      h.clickContinue();

      // TODO add Radiation & Lejeune questions when they exist

      // ORANGE_2_2_B
      h.verifyUrl(ROUTES.ORANGE_2_2_B);
      h.clickBack();

      // ORANGE_2_2_A
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.clickBack();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.clickBack();

      // Home
      h.verifyUrl(ROUTES.HOME);
    });
  });
});
