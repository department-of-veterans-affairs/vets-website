import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow B
// Service Period - 1989 or earlier
// Agent Orange 2.2.A - I'm not sure
// Agent Orange 2.2.1.A - I'm not sure
// Agent Orange 2.2.2 - I'm not sure
// Agent Orange 2.2.3 - Yes
// Radiation 2.3.A - I'm not sure
// Camp Lejeune 2.4 - I'm not sure
// Results 1

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe(`1989 or earlier - "I'm not sure" to all Agent Orange (except 1), Radiation and Lejeune questions (Results Screen 1)`, () => {
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
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_1_A
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_2
      h.verifyUrl(ROUTES.ORANGE_2_2_2);
      h.selectRadio(h.ORANGE_2_2_2_INPUT, 2);
      h.clickContinue();

      // ORANGE_2_2_3
      h.verifyUrl(ROUTES.ORANGE_2_2_3);
      h.selectRadio(h.ORANGE_2_2_3_INPUT, 0);
      h.clickContinue();

      // TODO add Radiation & Lejeune questions and Results screen 1 when they exist

      // ORANGE_2_2_3
      h.verifyUrl(ROUTES.ORANGE_2_2_3);
      h.clickBack();

      // ORANGE_2_2_2
      h.verifyUrl(ROUTES.ORANGE_2_2_2);
      h.clickBack();

      // ORANGE_2_2_1_A
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
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
