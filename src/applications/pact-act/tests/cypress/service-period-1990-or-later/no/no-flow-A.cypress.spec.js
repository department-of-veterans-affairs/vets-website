import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow A
// Service Period - 1990 or later
// Burn Pit 2.1 - No
// Burn Pit 2.1.1 - No
// Burn Pit 2.1.2 - No
// Burn Pit 2.1.3 - No
// Main Flow 2.5 - No
// Results 3

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('1990 or later - "No" to all questions (Results page 3)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.selectRadio(h.SERVICE_PERIOD_INPUT, 0);
      h.clickContinue();

      // BURN_PIT_2_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.selectRadio(h.BURN_PIT_2_1_INPUT, 1);
      h.clickContinue();

      // BURN_PIT_2_1_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 1);
      h.clickContinue();

      // BURN_PIT_2_1_2
      h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
      h.selectRadio(h.BURN_PIT_2_1_2_INPUT, 1);
      h.clickContinue();

      // BURN_PIT_2_1_3
      h.verifyUrl(ROUTES.BURN_PIT_2_1_3);
      h.selectRadio(h.BURN_PIT_2_1_3_INPUT, 1);
      h.clickContinue();

      // MAIN_FLOW_2_5
      h.verifyUrl(ROUTES.MAIN_FLOW_2_5);
      h.selectRadio(h.MAIN_FLOW_2_5_INPUT, 1);
      h.clickContinue();

      // RESULTS 3
      h.verifyUrl(ROUTES.RESULTS_3);
      h.verifyElement(h.RESULTS_3_HEADER);
      h.clickResultsBack();

      // MAIN_FLOW_2_5
      h.verifyUrl(ROUTES.MAIN_FLOW_2_5);
      h.clickBack();

      // BURN_PIT_2_1_3
      h.verifyUrl(ROUTES.BURN_PIT_2_1_3);
      h.clickBack();

      // BURN_PIT_2_1_2
      h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
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
