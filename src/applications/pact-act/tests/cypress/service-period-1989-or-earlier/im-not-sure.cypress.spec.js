import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe(`1989 or earlier - "I'm not sure" and single checkbox responses throughout`, () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit('/pact-act-wizard-test');

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.verifyElement(h.SERVICE_PERIOD_INPUT);
      h.selectRadio(h.SERVICE_PERIOD_INPUT, 1);
      h.clickContinue();

      // TODO: test navigation to Agent Orange question(s) when they exist

      // SERVICE_PERIOD
      h.verifyUrl(ROUTES.SERVICE_PERIOD);
      h.verifyElement(h.SERVICE_PERIOD_INPUT);
      h.clickBack();

      // Home
      h.verifyElement(h.START_LINK);
    });
  });
});
