import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import optedIn from './fixtures/opted-in-status.json';
// import optedOut from './fixtures/opted-out-status.json';
import postOptOutResponse from './fixtures/post-opt-out-response.json';
import postOptInResponse from './fixtures/post-opt-in-response.json';

describe('Medical Records validate settings page', () => {
  it('visits settings page', () => {
    const site = new MedicalRecordsSite();
    site.login();

    // Intercept GET status (opted in)
    cy.intercept(
      'GET',
      'my_health/v1/health_records/sharing/status',
      optedIn,
    ).as('statusOptedIn');

    // Visit settings page
    cy.visit('my-health/medical-records/settings');
    cy.wait('@statusOptedIn');
    // cy.wait(2000);

    // Verify opted-in status
    cy.get('va-card')
      .find('h3')
      .contains('Your sharing setting: Opted in');

    // Intercept POST opt out
    cy.intercept(
      'POST',
      'my_health/v1/health_records/sharing/optout',
      postOptOutResponse,
    ).as('postOptOut');

    // Select opt out
    cy.get('[data-testid="open-opt-in-out-modal-button"]').click();
    // cy.wait(2000);
    cy.get('button:contains("Yes, opt out")').click();
    // cy.wait(2000);
    cy.wait('@postOptOut');

    // Verify opted-out status
    cy.get('va-card')
      .find('h3')
      .contains('Your sharing setting: Opted out');
    // cy.get('va-alert').contains('You’ve opted out of sharing');
    cy.get('div.settings')
      .children()
      .first()
      .contains('You’ve opted out of sharing');

    cy.intercept(
      'POST',
      'my_health/v1/health_records/sharing/optin',
      postOptInResponse,
    ).as('postOptIn');
    // cy.wait(2000);

    // Select opt in
    cy.get('[data-testid="open-opt-in-out-modal-button"]').click(); // is this the right selector?
    // cy.wait(2000);
    cy.get('button:contains("Yes, opt in")').click();
    cy.wait('@postOptIn');

    // Verify opted-in status
    cy.get('va-card')
      .find('h3')
      .contains('Your sharing setting: Opted in');
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
