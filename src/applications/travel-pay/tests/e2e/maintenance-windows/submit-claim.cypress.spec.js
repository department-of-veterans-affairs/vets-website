/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { rootUrl } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe('Submit Mileage Only Claims', () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initialMaintenanceWindow.upcoming();
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
    ApiInitializer.initializeClaimDetails.happyPath();
    ApiInitializer.initializeAppointment.happyPath();
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
