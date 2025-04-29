import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow A
// Service Period - 1989 or earlier
// Agent Orange 2.2.A - I'm not sure
// Agent Orange 2.2.1.A - I'm not sure
// Agent Orange 2.2.2 - I'm not sure
// Agent Orange 2.2.3 - I'm not sure
// Radiation 2.3.A - I'm not sure
// Camp Lejeune 2.4 - I'm not sure
// Main Flow 2.5 - I'm not sure
// Results 3

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe(`1989 or earlier - "I'm not sure" to all questions (Results page 3)`, () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

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
      h.selectRadio(h.ORANGE_2_2_3_INPUT, 2);
      h.clickContinue();

      // RADIATION_2_3_A
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.selectRadio(h.RADIATION_2_3_A_INPUT, 2);
      h.clickContinue();

      // LEJEUNE_2_4
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.selectRadio(h.LEJEUNE_2_4_INPUT, 2);
      h.clickContinue();

      // MAIN_FLOW_2_5
      h.verifyUrl(ROUTES.MAIN_FLOW_2_5);
      h.selectRadio(h.MAIN_FLOW_2_5_INPUT, 2);
      h.clickContinue();

      // RESULTS 3
      h.verifyUrl(ROUTES.RESULTS_3);
      h.verifyElement(h.RESULTS_3_HEADER);
      h.clickResultsBack();

      // MAIN_FLOW_2_5
      h.verifyUrl(ROUTES.MAIN_FLOW_2_5);
      h.clickBack();

      // LEJEUNE_2_4
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.clickBack();

      // RADIATION_2_3_A
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.clickBack();

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
