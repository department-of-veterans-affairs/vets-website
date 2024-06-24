import manifest from '../../manifest.json';
import mockDependents from './fixtures/mock-dependents.json';
import mockNoAwardDependents from './fixtures/mock-no-dependents-on-award.json';
import { PAGE_TITLE } from '../../util';

const DEPENDENTS_ENDPOINT = 'v0/dependents_applications/show';

const testAxe = () => {
  cy.injectAxe();
  cy.axeCheck();
};

const testHappyPath = () => {
  cy.intercept('GET', DEPENDENTS_ENDPOINT, mockDependents).as('mockDependents');
  cy.visit(manifest.rootUrl);
  testAxe();
  cy.findByRole('heading', { name: new RegExp(PAGE_TITLE, 'i') }).should(
    'exist',
  );
  cy.get('dt').should('have.length', 12);
  testAxe();
};

const testNoDependentsOnAward = () => {
  cy.intercept('GET', DEPENDENTS_ENDPOINT, mockNoAwardDependents).as(
    'mockNoAwardDependents',
  );
  cy.visit(manifest.rootUrl);
  cy.findByText(
    'There are no dependents associated with your VA benefits',
  ).should('exist');
  testAxe();
};

const testEmptyResponse = () => {
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
  cy.visit(manifest.rootUrl);
  cy.findByRole('heading', {
    name: /We don’t have dependents information on file for you/i,
  }).should('exist');
  testAxe();
};

const testServerError = () => {
  cy.intercept(DEPENDENTS_ENDPOINT, {
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
  cy.visit(manifest.rootUrl);
  cy.findByRole('heading', {
    name: /We’re sorry. Something went wrong on our end/i,
  }).should('exist');
  testAxe();
};

describe('View VA dependents', () => {
  beforeEach(() => {
    cy.login();
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
