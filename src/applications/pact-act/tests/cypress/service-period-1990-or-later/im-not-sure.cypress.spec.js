import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe(`1990 or later - "I'm not sure" to all questions (Results Screen 3)`, () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.selectRadio(h.SERVICE_PERIOD_INPUT, 0);
      h.clickContinue();

      // BURN_PIT_2_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1);
      h.selectRadio(h.BURN_PIT_2_1_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1_1
      h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      h.selectRadio(h.BURN_PIT_2_1_1_INPUT, 2);
      h.clickContinue();

      // BURN_PIT_2_1_2
      h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
      h.selectRadio(h.BURN_PIT_2_1_2_INPUT, 2);
      h.clickContinue();

      // RESULTS 3
      h.verifyUrl(ROUTES.RESULTS_3);
      h.verifyElement(h.RESULTS_3_HEADER);
      h.clickResultsBack();

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
