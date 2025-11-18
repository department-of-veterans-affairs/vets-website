import { rootUrl } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe('Submit Mileage Only Claims', () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeMaintenanceWindow.current();
    ApiInitializer.initializeFeatureToggle.withSmocOnly();
    ApiInitializer.initializeClaims.errorPath();
    ApiInitializer.initializeClaimDetails.errorPath();
    ApiInitializer.initializeAppointment.errorPath();
  });

  it('defaults to the Introduction page', () => {
    cy.login(user);
    cy.visit(`${rootUrl}/file-new-claim/12345`);
    cy.injectAxeThenAxeCheck();

    // Check if the maintenance window message is displayed
    cy.contains('This application is down for maintenance').should(
      'be.visible',
    );
  });
});
