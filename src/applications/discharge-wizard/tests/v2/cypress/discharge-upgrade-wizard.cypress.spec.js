import * as h from './helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';

xdescribe('Discharge Upgrade Wizard', () => {
  describe('Base navigation', () => {
    it('navigates through the flow forward successfully', () => {
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
        h.get15YearsPast(),
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

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
    });
  });
  describe('Forward and Backward navigation', () => {
    it('navigates through the flow forward/backward successfully', () => {
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
        h.get15YearsPast(),
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
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);

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

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.clickBack();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.clickBack();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.clickBack();

      // Home
      h.verifyUrl(`${ROUTES.HOME}1`);
    });

    it('navigates through the flow forward/backward successfully with changed answers for Reason question', () => {
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
        h.get15YearsPast(),
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

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.clickBack();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.clickBack();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.clickBack();

      // Home
      h.verifyUrl(`${ROUTES.HOME}1`);
    });
  });
});
