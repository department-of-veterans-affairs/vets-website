import * as h from '../helpers';
import { ROUTES } from '../../../../constants';
import { SHORT_NAME_MAP } from '../../../../constants/question-data-map';

xdescribe('Discharge Upgrade Wizard: Discharge Update to form DD214 from DD215 Flow', () => {
  describe('Base navigation', () => {
    it('navigates through the flow forward successfully', () => {
      cy.visit(`${h.ROOT}/introduction1`);

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
      h.selectRadio(h.REASON_INPUT, 5);
      h.clickContinue();

      // PREVIOUS_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.selectRadio(h.PREV_APPLICATION_TYPE_INPUT, 2);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
    });
  });
});
