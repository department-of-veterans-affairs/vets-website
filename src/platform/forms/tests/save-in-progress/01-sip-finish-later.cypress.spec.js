import moment from 'moment';
import mockUser from '../fixtures/mocks/mockUser';
import mock1010Get from '../fixtures/mocks/mock1010Get';
import mock1010Put from '../fixtures/mocks/mock1010Put';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('SIP Finish Later', () => {
  // Skipping test as it is disabled in nightwatch.  Final assertion error message does not show up on the front end.
  it.skip('Saves, Loads, and Fails appropriately in all cases', () => {
    cy.intercept('POST', '/v0/health_care_applications', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
    cy.intercept('GET', '/v1/sessions/slo/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v1/sessions/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/in_progress_forms/1010ez', mock1010Get);
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', mock1010Put);
    cy.login(mockUser);

    cy.visit('/health-care/apply/application');
    cy.get('body').should('be.visible');
    cy.title().should('contain', 'Apply for Health Care | Veterans Affairs');
    cy.get('.usa-button-primary', { timeout: Timeouts.slow });

    cy.injectAxeThenAxeCheck();

    // load an in progress form
    cy.get('.usa-button-primary')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', '/veteran-information/birth-information');

    cy.get('.schemaform-sip-save-link');
    cy.get('#root_veteranSocialSecurityNumber').should(
      'have.attr',
      'value',
      '123445544',
    );

    // save and finish a form later
    cy.fill(
      'input[name="root_view:placeOfBirth_cityOfBirth"]',
      'Northampton, MA',
    );
    cy.get('.schemaform-sip-save-link').click();

    cy.url().should('not.contain', '/veteran-information/birth-information');
    cy.url().should('contain', 'form-saved');

    cy.axeCheck();

    cy.get('.usa-button-primary').click();
    cy.get('.schemaform-sip-save-link').should('be.visible');
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 500,
    });
    cy.get('.schemaform-sip-save-link').click();

    cy.get('.usa-alert-error', { timeout: Timeouts.slow }).should('be.visible');
    cy.url().should('contain', 'birth-information');

    cy.get('.usa-alert-error').should(
      'contain',
      'Something went wrong when saving your application',
    );

    /* eslint-disable camelcase */
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      data: {
        attributes: {
          metadata: {
            version: 0,
            returnUrl: '/veteran-information/birth-information',
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

    cy.get('.saved-form-metadata-container', { timeout: Timeouts.slow });
    cy.url().should('contain', 'form-saved');

    // test start over, but all it really does is fetch the form again
    cy.get('.usa-button-secondary').click();
    cy.get('.va-modal').should('be.visible');
    cy.get('.va-modal .usa-button-primary').click();
    cy.get('.schemaform-chapter-progress');

    cy.url().should('not.contain', 'form-saved');
    cy.url().should('contain', '/veteran-information/birth-information');

    // test 401 error when saving
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 401,
    }).as('401Form');
    cy.get('.schemaform-sip-save-link').click();

    cy.get('.usa-alert-error').should('contain', "Sorry, you're signed out");
  });
});
