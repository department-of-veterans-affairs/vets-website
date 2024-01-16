import * as h from '../../helpers';
import { ROUTES } from '../../../../constants';

// Flow A
// Service Period - During both
// Burn Pit 2.1 - Yes
// Agent Orange 2.2.A - Yes
// Agent Orange 2.2.B - Select 1 checkbox
// Radiation 2.3.A - Yes
// Radiation 2.3.B - Select 1 checkbox
// Camp Lejeune 2.4 - Yes
// Results 1 (Yes to more than one category)

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('During both of these time periods - "Yes" to two or more question categories (Results Screen 1)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

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
      h.selectRadio(h.BURN_PIT_2_1_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_A
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
      h.selectRadio(h.ORANGE_2_2_A_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_B
      h.verifyUrl(ROUTES.ORANGE_2_2_B);
      h.selectCheckbox(h.ORANGE_2_2_B_INPUT, 0);
      h.clickContinue();

      // RADIATION_2_3_A
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.selectRadio(h.RADIATION_2_3_A_INPUT, 0);
      h.clickContinue();

      // RADIATION_2_3_B
      h.verifyUrl(ROUTES.RADIATION_2_3_B);
      h.selectCheckbox(h.RADIATION_2_3_B_INPUT, 1);
      h.clickContinue();

      // LEJEUNE_2_4
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.selectRadio(h.LEJEUNE_2_4_INPUT, 0);
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

      // LEJEUNE_2_4
      h.verifyUrl(ROUTES.LEJEUNE_2_4);
      h.clickBack();

      // RADIATION_2_3_B
      h.verifyUrl(ROUTES.RADIATION_2_3_B);
      h.clickBack();

      // RADIATION_2_3_A
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.clickBack();

      // ORANGE_2_2_B
      h.verifyUrl(ROUTES.ORANGE_2_2_B);
      h.clickBack();

      // ORANGE_2_2_A
      h.verifyUrl(ROUTES.ORANGE_2_2_A);
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
