import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('SM 404 ERRORS', () => {
  it('verify 404 page visiting inbox', () => {
    SecureMessagingSite.login();

    cy.visit(`${Paths.UI_MAIN}/inbox404`);
    PatientErrorPage.verifyPageNotFoundContent();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
