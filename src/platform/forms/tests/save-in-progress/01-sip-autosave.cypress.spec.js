import Timeouts from 'platform/testing/e2e/timeouts';
import moment from 'moment';
import mockUser from '../fixtures/mocks/mockUser';
import mockXX123Get from '../fixtures/mocks/mockXX123Get';
import mockXX123Put from '../fixtures/mocks/mockXX123Put';

describe('SIP Autosave Test', () => {
  it('fails and properly recovers', () => {
    cy.intercept('POST', '/v0/mock_sip_form', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
    cy.intercept('GET', '/v1/sessions/slo/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v1/sessions/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/in_progress_forms/XX-123', mockXX123Get);
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', mockXX123Put);
    cy.login(mockUser);

    cy.visit('/mock-sip-form');
    cy.get('body').should('be.visible');
    cy.title().should('contain', 'Mock SIP Form');
    cy.get('va-button', { timeout: Timeouts.slow }).should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get('va-button[data-testid="continue-your-application"]')
      .first()
      .shadow()
      .find('button')
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', '/first-page');

    cy.get('.schemaform-sip-save-link').should('be.visible');
    cy.get('input[name="root_email"]').should(
      'have.attr',
      'value',
      'test@test.com',
    );
    cy.fill('input[name="root_veteranFullName_first"]', 'Larry');
    cy.get('.saved-success-container').should('be.visible');
    cy.get('.main .usa-button-primary').click();
    cy.get('.schemaform-sip-save-link').should('be.visible');
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', {
      statusCode: 500,
    });

    cy.fill('input[name="root_veteranFullName_first"]', 'Steve');
    cy.get('va-alert[status="error"]').should('be.visible');

    cy.url().should('contain', 'first-page');
    cy.get('va-alert[status="error"]').should(
      'contain',
      'We’re sorry, but we’re having some issues and are working to fix them',
    );

    // Recover and save after errors
    /* eslint-disable camelcase */

    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', {
      data: {
        attributes: {
          metadata: {
            version: 0,
            returnUrl: '/first-page',
            savedAt: 1498588443698,
            expires_at: moment()
              .add(1, 'day')
              .unix(),
            last_updated: 1498588443,
          },
        },
      },
    });
    /* eslint-enable camelcase */

    cy.fill('input[name="root_veteranFullName_first"]', 'Eli');
    cy.get('.saved-success-container').should('be.visible');

    cy.url().should('contain', '/first-page');

    // fail to save a form because signed out
    // Can't recover from this because it logs you out and we'd have to log in again

    cy.get('.main .usa-button-primary').click();
    cy.get('.schemaform-sip-save-link');
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', {
      statusCode: 401,
    });
    cy.fill('input[name="root_veteranFullName_first"]', 'Bob');
    cy.get('va-alert[status="error"]');

    cy.url().should('contain', 'first-page');

    cy.get('va-alert[status="error"]').should(
      'contain',
      'Sorry, you’re no longer signed in',
    );
  });
});
