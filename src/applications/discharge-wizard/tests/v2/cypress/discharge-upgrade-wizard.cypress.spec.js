import * as h from './helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';

// Flow B
// Service Period - During both
// Burn Pit 2.1 - No
// Burn Pit 2.1.1 - No
// Burn Pit 2.1.2 - Yes
// Agent Orange 2.2.A - No
// Agent Orange 2.2.1.A - No
// Agent Orange 2.2.2 - No
// Agent Orange 2.2.3 - No
// Radiation 2.3.A - No
// Camp Lejeune 2.4 - No
// Results 1 ("Yes" to one category, not Camp Lejeune)

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('Discharge Upgrade Wizard', () => {
  describe('Base navigation', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(`${h.ROOT}/introduction1`);

      // Home
      h.verifyUrl(`${ROUTES.HOME}1`);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.selectRadio(h.SERVICE_BRANCH_INPUT, 3);
      h.clickContinue();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.selectDropdown(
        h.DISCHARGE_YEAR_INPUT,
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        '2009',
      );
      h.clickContinue();

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.selectDropdown(
        h.DISCHARGE_MONTH_INPUT,
        SHORT_NAME_MAP.DISCHARGE_MONTH,
        3,
      );
      h.clickContinue();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 3);
      h.clickContinue();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
      h.selectRadio(h.INTENTION_INPUT, 1);
      h.clickContinue();

      // COURT_MARTIAL
      h.verifyUrl(ROUTES.COURT_MARTIAL);
      h.selectRadio(h.COURT_MARTIAL_INPUT, 1);
      h.clickContinue();

      // PREVIOUS_APPLICATION
      h.verifyUrl(ROUTES.PREVIOUS_APPLICATION);

      //   // RESULTS 1, P1
      //   h.verifyUrl(ROUTES.RESULTS_1_1);
      //   h.verifyElement(h.RESULTS_1_1_HEADER);
      //   h.clickResultsContinue();

      //   // RESULTS 1, P2
      //   h.verifyUrl(ROUTES.RESULTS_1_2);
      //   h.verifyElement(h.RESULTS_1_2_HEADER);
      //   h.clickResultsBack();

      //   // RESULTS 1, P1
      //   h.verifyUrl(ROUTES.RESULTS_1_1);
      //   h.clickResultsBack();

      //   // LEJEUNE_2_4
      //   h.verifyUrl(ROUTES.LEJEUNE_2_4);
      //   h.clickBack();

      //   // RADIATION_2_3_A
      //   h.verifyUrl(ROUTES.RADIATION_2_3_A);
      //   h.clickBack();

      //   // ORANGE_2_2_3
      //   h.verifyUrl(ROUTES.ORANGE_2_2_3);
      //   h.clickBack();

      //   // ORANGE_2_2_2
      //   h.verifyUrl(ROUTES.ORANGE_2_2_2);
      //   h.clickBack();

      //   // ORANGE_2_2_1_A
      //   h.verifyUrl(ROUTES.ORANGE_2_2_1_A);
      //   h.clickBack();

      //   // ORANGE_2_2_A
      //   h.verifyUrl(ROUTES.ORANGE_2_2_A);
      //   h.clickBack();

      //   // BURN_PIT_2_1_2
      //   h.verifyUrl(ROUTES.BURN_PIT_2_1_2);
      //   h.clickBack();

      //   // BURN_PIT_2_1_1
      //   h.verifyUrl(ROUTES.BURN_PIT_2_1_1);
      //   h.clickBack();

      //   // BURN_PIT_2_1
      //   h.verifyUrl(ROUTES.BURN_PIT_2_1);
      //   h.clickBack();

      //   // SERVICE_PERIOD
      //   h.verifyUrl(ROUTES.SERVICE_PERIOD);
      //   h.clickBack();

      //   // Home
      //   h.verifyUrl(ROUTES.HOME);
    });
  });
});
