import { appName, rootUrl } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- claim detail`, () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', {});

    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.errorPath();
    ApiInitializer.initializeClaimDetails.errorPath();
    ApiInitializer.initializeMaintenanceWindow.none();
  });

  it('shows the maintenance window if the API call returns maintenance data', () => {
    // Visit the root URL
    cy.login(user);
    cy.visit(`${rootUrl}/claims/123`);
    cy.injectAxeThenAxeCheck();

    // Check if the maintenance window message is displayed
    cy.contains('There was an error loading the claim details.').should(
      'be.visible',
    );
  });
});
