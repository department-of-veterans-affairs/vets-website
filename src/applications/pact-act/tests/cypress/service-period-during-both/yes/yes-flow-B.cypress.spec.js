import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow B
// Service Period - During both
// Burn Pit 2.1 - No
// Burn Pit 2.1.1 - Yes
// Agent Orange 2.2.A - No
// Agent Orange 2.2.1.A - Yes
// Agent Orange 2.2.1.B - Select 1 checkbox
// Radiation 2.3.A - Yes
// Radiation 2.3.B - Select 1 checkbox
// Camp Lejeune 2.4 - Yes
// Results 1 (Yes to more than one category)

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('During both of these time periods - "Yes" to two or more categories (Results Screen 1)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit('/pact-act-wizard-test');

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.selectRadio(h.SERVICE_PERIOD_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.selectRadio(h.BURN_PIT_2_1_INPUT, 1);
      h.clickContinue();

      // BURN_PIT_2_1_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_A
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_1_A
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_1_B
      h.verifyUrl(ROUTES.ORANGE_2_2_1_B);
      h.selectCheckbox(h.ORANGE_2_2_1_B_INPUT, 0);
      h.clickContinue();

      // TODO add Radiation & Lejeune questions and Results screen 1

      // ORANGE_2_2_1_B
      h.verifyUrl(ROUTES.ORANGE_2_2_1_B);
      h.clickBack();

      // ORANGE_2_2_1_A
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.clickBack();

      // ORANGE_2_2_A
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.clickBack();

      // BURN_PIT_2_1_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.clickBack();

      // BURN_PIT_2_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.clickBack();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.clickBack();

      // Home
      h.verifyUrl(ROUTES.HOME);
    });
  });
});
