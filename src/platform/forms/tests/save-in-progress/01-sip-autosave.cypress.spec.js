import Timeouts from 'platform/testing/e2e/timeouts';
import moment from 'moment';
import mockUser from '../fixtures/mocks/mockUser';
import mock1010Get from '../fixtures/mocks/mock1010Get';
import mock1010Put from '../fixtures/mocks/mock1010Put';

describe('SIP Autosave Test', () => {
  it('fails and properly recovers', () => {
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
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status', {
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      enrollmentDate: '2018-01-24T00:00:00.000-06:00',
      preferredFacility: '987 - CHEY6',
      parsedStatus: 'none_of_the_above',
    });
    cy.title().should('contain', 'Apply for Health Care | Veterans Affairs');
    cy.get('.main .usa-button-primary', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.injectAxeThenAxeCheck();
    cy.get('.main .usa-button-primary')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', '/veteran-information/birth-information');

    cy.get('.schemaform-sip-save-link').should('be.visible');
    cy.get('#root_veteranSocialSecurityNumber').should(
      'have.attr',
      'value',
      '123445544',
    );
    cy.fill(
      'input[name="root_view:placeOfBirth_cityOfBirth"]',
      'Northhampton, MA',
    );
    cy.get('.saved-success-container').should('be.visible');
    cy.get('.main .usa-button-primary').click();
    cy.get('.schemaform-sip-save-link').should('be.visible');
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      statusCode: 500,
      body: {},
    });

    cy.fill('input[name="root_view:placeOfBirth_cityOfBirth"]', 'Amherst, MA');
    cy.get('.usa-alert-error').should('be.visible');

    cy.url().should('contain', 'birth-information');
    cy.get('.usa-alert-error').should(
      'contain',
      'We’re sorry, but we’re having some issues and are working to fix them',
    );

    // Recover and save after errors
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

    cy.fill('input[name="root_view:placeOfBirth_cityOfBirth"]', 'Florence, MA');
    cy.get('.saved-success-container').should('be.visible');

    cy.url().should('contain', '/veteran-information/birth-information');

    // fail to save a form because signed out
    // Can't recover from this because it logs you out and we'd have to log in again

    cy.get('.main .usa-button-primary').click();
    cy.get('.schemaform-sip-save-link');
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 401,
    });
    cy.fill('input[name="root_view:placeOfBirth_cityOfBirth"]', 'Amherst, MA');
    cy.get('.usa-alert-error');

    cy.url().should('contain', 'birth-information');

    cy.get('.usa-alert-error').should(
      'contain',
      'Sorry, you’re no longer signed in',
    );
  });
});
