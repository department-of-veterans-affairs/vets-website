import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import optedIn from './fixtures/opted-in-status.json';
import optedOut from './fixtures/opted-out-status.json';
import postOptOutResponse from './fixtures/post-opt-out-response.json';
import postOptInResponse from './fixtures/post-opt-in-response.json';

describe('Medical Records validate settings page', () => {
  it('visits settings page', () => {
    const site = new MedicalRecordsSite();
    site.login();

    // Intercept GET status #1 (opted in)
    cy.intercept(
      'GET',
      'my_health/v1/health_records/sharing/status',
      optedIn,
    ).as('statusOptedIn');

    // cy.intercept('my_health/v1/health_records/sharing/status', {
    //   // fixture: './fixtures/opted-in-status.json', // optedIn,
    //   fixture:
    //     './applications/mhv-medical-records/tests/e2e/fixtures/opted-in-status.json',
    //   times: 1,
    // }).as('statusOptedIn');

    // Visit settings page
    cy.visit('my-health/medical-records/settings');
    cy.wait('@statusOptedIn');

    // // Intercept POST opt out
    // cy.intercept(
    //   'POST',
    //   '/health_records/sharing/optout',
    //   postOptOutResponse,
    // ).as('postOptOut');
    // cy.wait(2000);
    // Intercept POST opt out
    cy.intercept(
      'POST',
      'my_health/v1/health_records/sharing/optout',
      postOptOutResponse,
    ).as('postOptOut');
    // cy.wait(2000);

    // Intercept GET status #2 (opted out)
    cy.intercept(
      'GET',
      'my_health/v1/health_records/sharing/status',
      optedOut,
    ).as('statusOptedOut');

    // cy.intercept('my_health/v1/health_records/sharing/status', {
    //   // fixture: './fixtures/opted-in-status.json', // optedIn,
    //   fixture:
    //     './applications/mhv-medical-records/tests/e2e/fixtures/opted-out-status.json',
    //   times: 1,
    // }).as('statusOptedOut');

    cy.get('[data-testid="open-opt-in-out-modal-button"]').click();
    // cy.wait(2000);
    cy.get('button:contains("Yes, opt out")').click();

    cy.wait('@postOptOut');
    // cy.wait('@statusOptedOut');

    // Intercept GET status #3 (opted in)
    cy.intercept(
      'GET',
      'my_health/v1/health_records/sharing/status',
      optedOut,
    ).as('statusOptedOut');

    cy.intercept(
      'POST',
      'my_health/v1/health_records/sharing/optin',
      postOptInResponse,
    ).as('postOptIn');
    // cy.wait(2000);

    cy.get('[data-testid="open-opt-in-out-modal-button"]').click(); // is this the right selector?
    // cy.wait(2000);
    cy.get('button:contains("Yes, opt in")').click();

    cy.get('va-alert').contains('You’ve opted back in to sharing');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
