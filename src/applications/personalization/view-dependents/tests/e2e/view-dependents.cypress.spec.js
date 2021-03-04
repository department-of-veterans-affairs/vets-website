import disableFTUXModals from 'platform/user/tests/disableFTUXModals';
import { rootUrl } from '../../manifest.json';
import mockDependents from './fixtures/mock-dependents.json';
import mockNoAwardDependents from './fixtures/mock-no-dependents-on-award.json';

const DEPENDENTS_ENDPOINT = '/dependents_applications/show';

const testAxe = () => {
  cy.injectAxe();
  cy.axeCheck();
};

const testHappyPath = () => {
  testAxe();
  cy.intercept('GET', DEPENDENTS_ENDPOINT, mockDependents).as('mockDependents');
  cy.findByText(/Your VA Dependents/).should('exist');
  cy.findAllByText(/Date of birth/).should('have.length', 4);
  testAxe();
};

const testNoDependentsOnAward = () => {
  testAxe();
  cy.intercept('GET', DEPENDENTS_ENDPOINT, mockNoAwardDependents).as(
    'mockNoAwardDependents',
  );
  cy.findByText(
    /There are no dependents associated with your VA benefits/,
  ).should('exist');
  testAxe();
};

const testEmptyResponse = () => {
  testAxe();
  cy.intercept('GET', DEPENDENTS_ENDPOINT, {
    body: {
      data: {
        id: '',
        attributes: {
          persons: [],
        },
      },
    },
  }).as('emptyResponse');
  cy.findByText(/We don't have dependents information on file for you/).should(
    'exist',
  );
  testAxe();
};

const testServerError = () => {
  testAxe();
  cy.intercept('GET', DEPENDENTS_ENDPOINT, {
    body: {
      errors: [
        {
          title: 'Server Error',
          code: '500',
          status: '500',
        },
      ],
    },
    statusCode: 500,
  }).as('serverError');
  cy.findByText(/We're sorry. Something went wrong on our end/).should('exist');
  testAxe();
};

describe('View VA dependents', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login();
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'va_view_dependents_access',
            value: true,
          },
        ],
      },
    });
    cy.visit(rootUrl);
  });

  it('should display a list of dependents on award and not on award', () => {
    testHappyPath();
  });
  it('should display a message when no dependents are on award', () => {
    testNoDependentsOnAward();
  });
  it('should display an alert when there are no dependents returned', () => {
    testEmptyResponse();
  });
  it('should display an alert when there is a server error', () => {
    testServerError();
  });
});
