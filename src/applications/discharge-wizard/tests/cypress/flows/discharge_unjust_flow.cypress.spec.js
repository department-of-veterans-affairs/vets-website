import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';

describe('Discharge Upgrade Wizard: Discharge Unjust Flow', () => {
  describe('Base navigation', () => {
    it('Flow 1: Navigates through the flow forward successfully', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.selectRadio(h.SERVICE_BRANCH_INPUT, 3);
      h.clickContinue();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.typeInInput(h.DISCHARGE_YEAR_INPUT, '2024');
      h.clickContinue();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 6);
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
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.selectRadio(h.PREV_APPLICATION_INPUT, 0);
      h.clickContinue();

      // PREVIOUS_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.selectRadio(h.PREV_APPLICATION_TYPE_INPUT, 2);
      h.clickContinue();

      // FAILURE_TO_EXHAUST
      h.verifyUrl(ROUTES.FAILURE_TO_EXHAUST);
      h.selectRadio(h.FAILURE_TO_EXHAUST_INPUT, 1);
      h.clickContinue();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.selectRadio(h.PRIOR_SERVICE_INPUT, 1);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
    });

    // Skips failure to exhaust question
    it('Flow 2: Navigates through the flow forward successfully', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.selectRadio(h.SERVICE_BRANCH_INPUT, 3);
      h.clickContinue();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.typeInInput(h.DISCHARGE_YEAR_INPUT, '2024');
      h.clickContinue();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 6);
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
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.selectRadio(h.PREV_APPLICATION_INPUT, 0);
      h.clickContinue();

      // PREVIOUS_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.selectRadio(h.PREV_APPLICATION_TYPE_INPUT, 0);
      h.clickContinue();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.selectRadio(h.PRIOR_SERVICE_INPUT, 1);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
    });

    // Skips prev app type and failure to exhaust question
    it('Flow 3: Navigates through the flow forward successfully', () => {
      cy.visit(h.ROOT);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.selectRadio(h.SERVICE_BRANCH_INPUT, 3);
      h.clickContinue();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.typeInInput(h.DISCHARGE_YEAR_INPUT, h.get15YearsPast());
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
      h.selectRadio(h.REASON_INPUT, 6);
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
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.selectRadio(h.PREV_APPLICATION_INPUT, 1);
      h.clickContinue();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.selectRadio(h.PRIOR_SERVICE_INPUT, 1);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
    });
  });
});
