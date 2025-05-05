import { appName, rootUrl } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- Status Page`, () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', {});

    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
    ApiInitializer.initializeClaimDetails.happyPath();
    ApiInitializer.initialMaintenanceWindow.upcoming();
  });

  it('shows the maintenance window if the API call returns maintenance data', () => {
    // Visit the root URL
    cy.login(user);
    cy.visit(rootUrl);
    cy.injectAxeThenAxeCheck();

    // Check if the maintenance window message is displayed
    cy.contains('This application is down for maintenance').should(
      'be.visible',
    );
  });
});
