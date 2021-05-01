import disableFTUXModals from 'platform/user/tests/disableFTUXModals';
import mockDisabilities from '../mockdata/200-response.json';
import mockTotalRating from '../mockdata/total-rating-response.json';
import mockErrorResponse from '../mockdata/error-response.json';

const RATED_DISABILITIES_PATH = '/disability/view-disability-rating/rating';
const DISABILITIES_ENDPOINT =
  '/disability_compensation_form/rated_disabilities';
const TOTAL_RATING_ENDPOINT = '/disability_compensation_form/rating_info';

const testHappyPath = () => {
  cy.intercept('GET', DISABILITIES_ENDPOINT, mockDisabilities).as(
    'mockDisabilities',
  );
  cy.intercept('GET', TOTAL_RATING_ENDPOINT, mockTotalRating).as(
    'mockTotalRating',
  );
  // TODO: Determine the source of the heading order violation and fix it. The
  // failure does not happen locally, but does happen in CI. This is likely due
  // to a data loading issue that results in the axe check happening _before_
  // data loading has completed and the DOM has finished rendering.
  cy.injectAndThenAxeCheck({ skipHeadingOrderCheck: true });
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
  cy.injectAndThenAxeCheck();
  cy.findByText(
    /We don’t have a combined disability rating on file for you/,
  ).should('exist');
  cy.findByText(/We don’t have rated disabilities on file for you/).should(
    'exist',
  );
};

describe('View rated disabilities', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login();
    cy.visit(RATED_DISABILITIES_PATH);
  });

  it('should display a total rating and a list of ratings', () => {
    testHappyPath();
  });
  it('should handle response errors by displaying the correct messaging', () => {
    testErrorStates();
  });
});
