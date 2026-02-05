import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} - helpdesk information component`, () => {
  describe('display content based on user status', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
    });

    it(`does not render for unverified users`, () => {
      LandingPage.visit({ verified: false });
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`does not render for unregistered "dslogon" users`, () => {
      LandingPage.visit({
        registered: false,
        verified: false,
        serviceName: 'dslogon',
      });
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`does not render for unregistered users with verified login (non-patient page)`, () => {
      LandingPage.visitNonPatientPage();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`renders for verified registered users`, () => {
      LandingPage.visit();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should.exist;
    });

    it(`renders for users without an MHV account`, () => {
      LandingPage.visit({ mhvAccountState: false });
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should.exist;
    });
  });
});
