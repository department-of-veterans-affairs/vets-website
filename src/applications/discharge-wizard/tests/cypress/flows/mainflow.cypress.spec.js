import * as h from '../helpers';
import { ROUTES } from '../../../constants';

describe('Discharge Upgrade Wizard Main Flow', () => {
  describe('Base navigation', () => {
    it('navigates through the flow forward successfully', () => {
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
      h.selectRadio(h.REASON_INPUT, 1);
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

      // PREVIOUS_APPLICATION_YEAR
      h.verifyUrl(ROUTES.PREV_APPLICATION_YEAR);
      h.selectRadio(h.PREV_APPLICATION_YEAR_INPUT, 1);
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
  });
  describe('Forward and Backward navigation', () => {
    it('navigates through the flow forward/backward successfully', () => {
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
      h.selectRadio(h.REASON_INPUT, 1);
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

      // PREVIOUS_APPLICATION_YEAR
      h.verifyUrl(ROUTES.PREV_APPLICATION_YEAR);
      h.selectRadio(h.PREV_APPLICATION_YEAR_INPUT, 1);
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
      h.clickBack();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.clickBack();

      // FAILURE_TO_EXHAUST
      h.verifyUrl(ROUTES.FAILURE_TO_EXHAUST);
      h.clickBack();

      // PREVIOUS_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.clickBack();

      // PREVIOUS_APPLICATION_YEAR
      h.verifyUrl(ROUTES.PREV_APPLICATION_YEAR);
      h.clickBack();

      // PREVIOUS_APPLICATION
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.clickBack();

      // COURT_MARTIAL
      h.verifyUrl(ROUTES.COURT_MARTIAL);
      h.clickBack();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
      h.clickBack();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.clickBack();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.clickBack();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.clickBack();

      // Home
      h.verifyUrl(ROUTES.HOME);
    });

    it('navigates through the flow forward/backward successfully with changed answers for Reason question', () => {
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
      h.selectRadio(h.REASON_INPUT, 0);
      h.clickContinue();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
      h.clickBack();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 2);
      h.clickContinue();

      // DISCHARGE_TYPE
      h.verifyUrl(ROUTES.DISCHARGE_TYPE);
      h.clickBack();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 4);
      h.clickContinue();

      // COURT_MARTIAL
      h.verifyUrl(ROUTES.COURT_MARTIAL);
      h.clickBack();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 5);
      h.clickContinue();

      // PREV_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.clickBack();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.clickBack();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.clickBack();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.clickBack();

      // Home
      h.verifyUrl(ROUTES.HOME);
    });
  });
});
