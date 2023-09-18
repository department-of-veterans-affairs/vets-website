import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('PACT Act', () => {
  describe('During both of these time periods - deep linking', () => {
    it('redirects to home when the service period page is loaded without the right criteria', () => {
      cy.visit('/pact-act-wizard-test/service-period-1');

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the burn pit 2-1 page is loaded without the right criteria', () => {
      cy.visit('/pact-act-wizard-test/burn-pit-2-1');

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the burn pit 2-1-1 page is loaded without the right criteria', () => {
      cy.visit('/pact-act-wizard-test/burn-pit-2-1-1');

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the burn pit 2-1-2 page is loaded without the right criteria', () => {
      cy.visit('/pact-act-wizard-test/burn-pit-2-1-2');

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });
  });
});
