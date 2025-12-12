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

  it('shows the error state if the API call fails', () => {
    // Visit the root URL
    cy.login(user);
    cy.visit(`${rootUrl}/claims/123`);
    cy.injectAxeThenAxeCheck();

    // Check if the error heading is displayed
    cy.get('h1').should('contain.text', 'Your travel reimbursement claim');

    cy.get('va-alert[status="error"]').should(
      'contain.text',
      'Something went wrong on our end',
    );
  });
});
