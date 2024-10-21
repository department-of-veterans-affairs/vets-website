import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow F
// Service Period - 1989 or earlier
// Agent Orange 2.2.A - No
// Agent Orange 2.2.1.A - No
// Agent Orange 2.2.2 - No
// Agent Orange 2.2.3 - Yes
// Radiation 2.3 - No
// Camp Lejeune 2.4 - Yes
// Main Flow 2.5 - Yes
// Results 4

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('1989 or earlier - "Yes" to several questions including the main flow question (Results page 4)', () => {
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
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 1);
      h.clickContinue();

      // ORANGE_2_2_1_A
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 1);
      h.clickContinue();

      // ORANGE_2_2_2
      h.verifyUrl(ROUTES.ORANGE_2_2_2);
      h.selectRadio(h.ORANGE_2_2_2_INPUT, 1);
      h.clickContinue();

      // ORANGE_2_2_3
      h.verifyUrl(ROUTES.ORANGE_2_2_3);
      h.selectRadio(h.ORANGE_2_2_3_INPUT, 0);
      h.clickContinue();

      // RADIATION_2_3_A
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.selectRadio(h.RADIATION_2_3_A_INPUT, 1);
      h.clickContinue();

      // LEJEUNE_2_4
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.selectRadio(h.LEJEUNE_2_4_INPUT, 0);
      h.clickContinue();

      // MAIN_FLOW_2_5
      h.verifyUrl(ROUTES.MAIN_FLOW_2_5);
      h.selectRadio(h.MAIN_FLOW_2_5_INPUT, 0);
      h.clickContinue();

      // RESULTS 4
      h.verifyUrl(ROUTES.RESULTS_4);
      h.verifyElement(h.RESULTS_4_HEADER);
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
