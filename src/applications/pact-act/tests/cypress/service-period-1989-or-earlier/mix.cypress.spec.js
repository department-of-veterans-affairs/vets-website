import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Mixed Answers
// Service Period - 1989 or earlier
// Agent Orange 2.2.A - No
// Agent Orange 2.2.1.A - No
// Agent Orange 2.2.2 - Yes
// Radiation 2.3.A - Click back
// Agent Orange 2.2.2 - Click back
// Agent Orange 2.2.1.A - Yes
// Agent Orange 2.2.1.B - Select 2 checkboxes
// Radiation 2.3.A - Yes
// Radiation 2.3.B - Select 1 checkbox
// Camp Lejeune 2.4 - I'm not sure
// Results 1

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('1989 or earlier - Mixed responses (Results screen 1)', () => {
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
      h.selectRadio(h.ORANGE_2_2_2_INPUT, 0);
      h.clickContinue();

      // RADIATION_2_3_A
      h.verifyUrl(ROUTES.RADIATION_2_3_A);
      h.clickBack();

      // ORANGE_2_2_2
      h.verifyUrl(ROUTES.ORANGE_2_2_2);
      h.clickBack();

      // ORANGE_2_2_1_A
      h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      h.selectRadio(h.ORANGE_2_2_1_A_INPUT, 0);
      h.clickContinue();

      // ORANGE_2_2_1_B
      h.verifyUrl(ROUTES.ORANGE_2_2_1_B);
      h.selectCheckbox(h.ORANGE_2_2_1_B_INPUT, 0);
      h.selectCheckbox(h.ORANGE_2_2_1_B_INPUT, 1);
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
      h.selectRadio(h.LEJEUNE_2_4_INPUT, 2);
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

      // ORANGE_2_2_1_B
      h.verifyUrl(ROUTES.ORANGE_2_2_1_B);
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
