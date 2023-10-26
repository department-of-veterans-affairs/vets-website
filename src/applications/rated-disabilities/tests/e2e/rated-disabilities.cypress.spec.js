import mockDisabilities from '../mockdata/200-response.json';
import mockTotalRating from '../mockdata/total-rating-response.json';
import mockErrorResponse from '../mockdata/error-response.json';

const RATED_DISABILITIES_PATH = '/disability/view-disability-rating/rating';
const DISABILITIES_ENDPOINT =
  'v0/disability_compensation_form/rated_disabilities';
const TOTAL_RATING_ENDPOINT = 'v0/disability_compensation_form/rating_info';

const testHappyPath = () => {
  cy.intercept('GET', DISABILITIES_ENDPOINT, mockDisabilities).as(
    'mockDisabilities',
  );
  cy.intercept('GET', TOTAL_RATING_ENDPOINT, mockTotalRating).as(
    'mockTotalRating',
  );

  cy.findByText(/90%/).should('exist');
  cy.findAllByText(/Diabetes mellitus0/).should('have.length', 2);
};

const testErrorStates = () => {
  cy.intercept('GET', DISABILITIES_ENDPOINT, {
    body: mockErrorResponse,
    statusCode: 404,
  }).as('clientError');
  cy.intercept('GET', TOTAL_RATING_ENDPOINT, {
    body: mockErrorResponse,
    statusCode: 404,
  }).as('totalRatingClientError');

  cy.findByText(
    /We don’t have a combined disability rating on file for you/,
  ).should('exist');
  cy.findByText(/We don’t have rated disabilities on file for you/).should(
    'exist',
  );
};

describe('View rated disabilities', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(RATED_DISABILITIES_PATH);
    cy.injectAxe();
  });

  it('should display a total rating and a list of ratings', () => {
    testHappyPath();
    cy.axeCheck();
  });

  it('should handle response errors by displaying the correct messaging', () => {
    testErrorStates();
    cy.axeCheck();
  });
});
