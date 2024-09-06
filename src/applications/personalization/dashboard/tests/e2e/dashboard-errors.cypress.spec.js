import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import manifest from 'applications/personalization/dashboard/manifest.json';
import paymentHistory from '../fixtures/test-empty-payments-response.json';

const intercept = cy => {
  cy.intercept('/v0/profile/service_history', serviceHistory);
  cy.intercept('/v0/profile/full_name', fullName);
  cy.intercept(
    '/v0/disability_compensation_form/rating_info',
    disabilityRating,
  );
  cy.intercept('/v0/profile/payment_history', paymentHistory);
};

describe('The My VA Dashboard: Full Page Errors', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
  });
  describe('/user success', () => {
    beforeEach(() => {
      intercept(cy);
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('does not show full page error when /user request is successful', () => {
      // make the a11y check
      cy.findByTestId('name-tag').should('exist');
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('/user failures', () => {
    beforeEach(() => {
      window.localStorage.setItem('hasSession', true);
    });

    afterEach(() => {
      window.localStorage.removeItem('hasSession');
    });

    it('shows full page error when /user request fails', () => {
      cy.intercept('GET', '/v0/user', {
        statusCode: 401,
        body: {
          errors: [
            {
              title: 'Bad Request',
              detail:
                'Received a bad request response from the upstream server',
              code: 'EVSS400',
              source: 'EVSS::DisabilityCompensationForm::Service',
              status: '400',
              meta: {},
            },
          ],
        },
      }).as('mockUser');
      cy.visit(manifest.rootUrl);
      // /user failures force session termination & no error message is shown
      // cypress environment doesn't seem to simulate this accurately.
      // On real environment, this redirects away from MyVA.
      cy.findByTestId('name-tag').should('not.exist');
      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });

    it('shows full page error when /user request partially fails', () => {
      cy.intercept('GET', '/v0/user', {
        statusCode: 296,
        body: {
          data: {
            ...mockUser.data,
            attributes: {
              ...mockUser.data.attributes,
              inProgressForms: [],
            },
          },
          meta: {
            errors: [
              {
                externalService: 'string',
                startTime: 'string',
                endTime: 'Unknown Type: string,null',
                description: 'string',
                status: 0,
              },
            ],
          },
        },
      }).as('mockUser');
      intercept(cy);
      cy.visit(manifest.rootUrl);
      cy.findByText(/We’re sorry. Something went wrong on our end./i).should(
        'exist',
      );
      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
