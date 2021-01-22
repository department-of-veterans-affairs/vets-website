import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import mockUser from '../fixtures/test-user.json';
import mockPayments from '../fixtures/test-payments-response.json';
import mockEmptyPayments from '../fixtures/test-empty-payments-response.json';
import mockEmptyPaymentsReceived from '../fixtures/test-empty-payments-received.json';
import mockEmptyPaymentsReturned from '../fixtures/test-empty-payments-returned.json';
import mockServerError from '../fixtures/500-error.json';
import mockClientError from '../fixtures/400-error.json';

const PAYMENTS_PATH = '/va-payment-history/payments';
const PAYMENTS_API_ENDPOINT = '/v0/profile/payment_history';

const testLoadingState = () => {
  cy.visit(PAYMENTS_PATH);
  cy.findByText(/Your VA payments/i).should('exist');
};

const testAxe = () => {
  cy.injectAxe();
  cy.axeCheck();
};

const testPagination = () => {
  cy.route('GET', PAYMENTS_API_ENDPOINT, mockPayments).as('mockPayments');
  testLoadingState();
  cy.wait('@mockPayments');
  cy.findByText(/Payments you received/i).should('exist');
  // check a11y
  testAxe();
  // Paginate to next set of data points
  cy.findByText(/Next/i).click();
  cy.findByText(/Displaying 7 - 9 of 9/i).should('exist');
};

const testNoPayments = () => {
  cy.route('GET', PAYMENTS_API_ENDPOINT, mockEmptyPayments).as(
    'mockEmptyPayments',
  );
  cy.visit(PAYMENTS_PATH);
  cy.wait('@mockEmptyPayments');
  cy.findByText(/We don’t have a record of VA payments for you/i).should(
    'exist',
  );
  testAxe();
};

const testEmptyPaymentsArray = (category = 'payments') => {
  if (category === 'returnPayments') {
    cy.route('GET', PAYMENTS_API_ENDPOINT, mockEmptyPaymentsReturned).as(
      'mockEmptyReturnedPayments',
    );
    testLoadingState();
    cy.wait('@mockEmptyReturnedPayments');
    cy.findByText(/Payments you received/i).should('exist');
    cy.findByText(/Displaying 1 - 6 of 9/i).should('exist');
    cy.findByText(/We don’t have a record of returned payments/i).should(
      'exist',
    );
  } else {
    cy.route('GET', PAYMENTS_API_ENDPOINT, mockEmptyPaymentsReceived).as(
      'mockEmptyReceivedPayments',
    );
    testLoadingState();
    cy.wait('@mockEmptyReceivedPayments');
    cy.findByText(/We don’t have a record of VA payments made to you/i).should(
      'exist',
    );
    cy.findByText(/Payments returned/i).should('exist');
  }
  testAxe();
};

const testApiError = (errCode = '500') => {
  if (errCode === '400') {
    cy.route({
      method: 'GET',
      url: PAYMENTS_API_ENDPOINT,
      status: 404,
      response: mockClientError,
    }).as('clientError');
    testLoadingState();
    cy.wait('@clientError');
    cy.findByText(/We don’t have a record of VA payments made to you/i, {
      selector: 'h2',
    });
  } else {
    cy.route({
      method: 'GET',
      url: PAYMENTS_API_ENDPOINT,
      status: 500,
      response: mockServerError,
    }).as('serverError');
    testLoadingState();
    cy.wait('@serverError');
    cy.findByText(/We’re sorry. Something went wrong on our end/i, {
      selector: 'h2',
    });
  }
  testAxe();
};

// Disabling until view-payments is ready for production
describe('View payment history', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUser);
  });
  it('should pass an aXe scan and paginate through payment data', () => {
    testPagination();
  });
  it('should display an alert when a user has no payment data on file', () => {
    testNoPayments();
  });
  it('should display an alert when a user has payments received but no payments returned to VA', () => {
    testEmptyPaymentsArray('returnPayments');
  });
  it('should display an alert when a user has payments returned to VA but no payments received', () => {
    testEmptyPaymentsArray();
  });
  it('should display an alert when a user recevies a 5xx error', () => {
    testApiError();
  });
  it('should display an alert when a user recevies a 4xx error', () => {
    testApiError('400');
  });
});
