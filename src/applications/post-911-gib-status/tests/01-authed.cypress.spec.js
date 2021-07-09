import Timeouts from 'platform/testing/e2e/timeouts';
import enrollmentData from './fixtures/mocks/enrollmentData.json';
import backendStatus from './fixtures/mocks/backendStatus.json';

describe('Gibs Test', () => {
  it('Fills the form', () => {
    cy.login();
    cy.intercept('GET', '/v0/post911_gi_bill_status', enrollmentData).as(
      'enrollmentData',
    );
    cy.intercept('GET', '/v0/backend_statuses/gibs', backendStatus).as(
      'backendStatus',
    );
    cy.intercept('GET', '/v0/feature_toggles?&cookie_id=*', {
      data: {
        features: [],
      },
    }).as('featureToggles');

    cy.visit('/education/gi-bill/post-9-11/ch-33-benefit');
    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get('.usa-button-primary.va-button-primary', {
      timeout: Timeouts.slow,
    }).click();

    cy.get('#gibs-full-name').should('contain', 'First Last');

    cy.get('#enrollment-0 h4').should(
      'contain',
      '11/01/2012 to 12/01/2012 at purdue university',
    );

    // Carrying forward this disabled section from nightwatch so it doesn't get lost

    // Click on print page
    // Commenting out for now until we can figure out why this is failing in Jenkins
    // NOTE: This no longer opens a new window
    // cy.get('#print-button').click('#print-button').window_handles(result => {
    //   const newWindow = result.value[1];
    //   client.switchWindow(newWindow);

    //   // Ensure print page renders.
    //   // We need to log in again here because Electron loses the session
    //   // when opening a new window.
    //   Auth.logIn(
    //     token,
    //     client,
    //     '/education/gi-bill/post-9-11/ch-33-benefit/print',
    //     3,
    //   )
    //     .waitForElementVisible('body', Timeouts.normal)
    //     .axeCheck('.main')
    //     .assert.title('Check Benefit: VA.gov')
    //     .waitForElementVisible('.print-status', Timeouts.slow); // First render of React may be slow.

    //   client.expect
    //     .element('.section-header')
    //     .text.to.contain('Post-9/11 GI Bill Benefit Information');
    // });
  });
});
