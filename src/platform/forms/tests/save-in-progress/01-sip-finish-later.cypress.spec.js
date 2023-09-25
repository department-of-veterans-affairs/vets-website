import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import mockUser from '../fixtures/mocks/mockUser';
import mockXX123Get from '../fixtures/mocks/mockXX123Get';
import mockXX123Put from '../fixtures/mocks/mockXX123Put';

describe('SIP Finish Later', () => {
  // Skipping test as it is disabled in nightwatch.  Final assertion error message does not show up on the front end.
  it('Saves, Loads, and Fails appropriately in all cases', () => {
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
    cy.get('va-button', { timeout: Timeouts.slow });

    cy.injectAxeThenAxeCheck();

    // load an in progress form
    cy.get('va-button[data-testid="continue-your-application"]')
      .first()
      .shadow()
      .find('button')
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', '/first-page');

    cy.get('.schemaform-sip-save-link');
    cy.get('input[name="root_email"]').should(
      'have.attr',
      'value',
      'test@test.com',
    );

    // save and finish a form later
    cy.fill('input[name="root_veteranFullName_first"]', 'Larry');
    cy.fill('input[name="root_veteranFullName_last"]', 'Walker');
    cy.get('.schemaform-sip-save-link').click();

    cy.url().should('not.contain', '/first-page');
    cy.url().should('contain', 'form-saved');

    cy.axeCheck();

    cy.get('va-button')
      .first()
      .shadow()
      .find('button')
      .click();
    cy.get('.schemaform-sip-save-link').should('be.visible');
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', {
      statusCode: 500,
    });
    cy.get('.schemaform-sip-save-link').click();

    cy.get('.usa-alert-error', { timeout: Timeouts.slow }).should('be.visible');
    cy.url().should('contain', 'first-page');

    cy.get('.usa-alert-error').should(
      'contain',
      'Something went wrong when saving your application',
    );

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

    cy.get('.schemaform-sip-save-link').click();
    cy.get('.usa-alert-body').should(
      'contain',
      'Your mock sip benefits application has been saved',
    );
    cy.url().should('contain', 'form-saved');

    // test start over, but all it really does is fetch the form again
    cy.get('va-button[secondary]')
      .first()
      .shadow()
      .find('button')
      .click();
    cy.get('.va-modal').should('be.visible');
    cy.get('.va-modal va-button-pair')
      .first()
      .shadow()
      .find('va-button')
      .first()
      .shadow()
      .find('button')
      .click();
    cy.get('.schemaform-chapter-progress');

    cy.url().should('not.contain', 'form-saved');
    cy.url().should('contain', '/first-page');

    // test 401 error when saving
    cy.fill('input[name="root_veteranFullName_first"]', 'Micky');
    cy.fill('input[name="root_veteranFullName_last"]', 'Mouse');
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', {
      statusCode: 401,
    }).as('401Form');
    cy.get('.schemaform-sip-save-link').click();

    cy.url().should('contain', 'first-page');
    cy.get('input[name="root_veteranFullName_first"]').should(
      'have.attr',
      'value',
      'Micky',
    );
    cy.get('input[name="root_veteranFullName_last"]').should(
      'have.attr',
      'value',
      'Mouse',
    );
  });
});
