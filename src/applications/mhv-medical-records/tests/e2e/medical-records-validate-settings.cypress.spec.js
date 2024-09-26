import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import optedIn from './fixtures/opted-in.json';

describe('Medical Records validate settings page', () => {
  it('visits settings page', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.intercept(
      'GET',
      'my_health/v1/health_records/sharing/status',
      optedIn,
    ).as('optedIn');
    cy.visit('my-health/medical-records/settings');
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
