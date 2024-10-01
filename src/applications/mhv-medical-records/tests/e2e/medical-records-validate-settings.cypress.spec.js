import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import SettingsPage from './pages/SettingsPage';
// import optedIn from './fixtures/opted-in-status.json';
// import optedOut from './fixtures/opted-out-status.json';
// import postOptOutResponse from './fixtures/post-opt-out-response.json';
// import postOptInResponse from './fixtures/post-opt-in-response.json';

describe('Medical Records validate settings page', () => {
  it('visits settings page', () => {
    const site = new MedicalRecordsSite();
    site.login();

    // // Intercept GET status (opted in)
    // cy.intercept(
    //   'GET',
    //   'my_health/v1/health_records/sharing/status',
    //   optedIn,
    // ).as('statusOptedIn');

    // // Visit settings page
    // cy.visit('my-health/medical-records/settings');
    // cy.wait('@statusOptedIn');

    SettingsPage.visitSettingsPage();

    // // Verify opted-in status
    // cy.get('va-card')
    //   .find('h3')
    //   .contains('Your sharing setting: Opted in');

    SettingsPage.verifyOptedInStatus();

    // // Intercept POST opt out
    // cy.intercept(
    //   'POST',
    //   'my_health/v1/health_records/sharing/optout',
    //   postOptOutResponse,
    // ).as('postOptOut');

    // // Select opt out
    // cy.get('[data-testid="open-opt-in-out-modal-button"]').click();

    // cy.get('button:contains("Yes, opt out")').click();

    // cy.wait('@postOptOut');

    SettingsPage.selectOptOut();

    // // Verify opted-out status
    // cy.get('va-card')
    //   .find('h3')
    //   .contains('Your sharing setting: Opted out');

    SettingsPage.verifyOptedOutStatus();

    // Verify opted-out alert
    // cy.get('section')
    //   .eq(1)
    //   .find('va-alert')
    //   .contains('You’ve opted out of sharing');

    SettingsPage.verifyOptedOutAlert();

    // cy.intercept(
    //   'POST',
    //   'my_health/v1/health_records/sharing/optin',
    //   postOptInResponse,
    // ).as('postOptIn');

    // // Select opt in
    // cy.get('[data-testid="open-opt-in-out-modal-button"]').click(); // is this the right selector?
    // cy.get('button:contains("Yes, opt in")').click();
    // cy.wait('@postOptIn');

    SettingsPage.selectOptIn();

    // // Verify opted-in status
    // cy.get('va-card')
    //   .find('h3')
    //   .contains('Your sharing setting: Opted in');

    SettingsPage.verifyOptedInStatus();

    // cy.get('section')
    //   .eq(1)
    //   .find('va-alert')
    //   .contains('You’ve opted back in to sharing');

    SettingsPage.verifyOptedInAlert();

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
