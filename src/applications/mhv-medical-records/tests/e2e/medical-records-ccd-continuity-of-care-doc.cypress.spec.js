import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import sessionStatus from './fixtures/session-status.json';

describe('Medical Records Authenticated Users', () => {
  it('Visits Medical Records Authenticated Users', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // cy.intercept('POST', '/my_health/v1/medical_records/session', {
    //     statusCode: 204,
    //     body: {},
    //   }).as('session');
    //   cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
    //     statusCode: 200,
    //     body: sessionStatus, // status response copied from staging
    //   }).as('status');
    site.loadPage();
    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');
    cy.visit('my-health/medical-records/download');

    cy.get('button[class="usa-accordion__button"]')
      .first()
      .click();

    cy.intercept('GET', 'my_health/v1/medical_records/ccd/generate').as(
      'generateCcd',
    );

    // cy.get('button[class="link-button"]')
    //   .first()
    //   .click();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
