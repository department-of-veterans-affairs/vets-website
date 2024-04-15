import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow B
// Service Period - 1990 or later
// Burn Pit 2.1 - No
// Burn Pit 2.1.1 - Yes
// Results 1

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('1990 or later -  "Yes" to one question category (Results Screen 1)', () => {
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
      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 0);
      h.clickContinue();

      // RESULTS 1, P1
      h.verifyUrl(ROUTES.RESULTS_1_1);
      h.verifyElement(h.RESULTS_1_1_HEADER);
      h.clickResultsContinue();

      // RESULTS 1, P2
      h.verifyUrl(ROUTES.RESULTS_1_2);
      h.verifyElement(h.RESULTS_1_2_HEADER);
      h.clickResultsBack();

      // RESULTS 1, P1
      h.verifyUrl(ROUTES.RESULTS_1_1);
      h.clickResultsBack();

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
