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
  cy.intercept('GET', PAYMENTS_API_ENDPOINT, mockPayments).as('mockPayments');
  testLoadingState();
  cy.wait('@mockPayments');
  cy.findByText(/Payments you received/i).should('exist');
  // check a11y
  testAxe();

  // Paginate to next set of payments
  cy.get('va-pagination')
    .shadow()
    .findByText(/Next/i)
    .click();
  cy.findByText(/Displaying 7 - 12 of 36/i).should('exist');
  // Paginate back to the previous set of payments
  cy.get('va-pagination')
    .shadow()
    .findByText(/Prev/i)
    .click();
  cy.findByText(/Displaying 1 - 6 of 36/i).should('exist');
};

const testPaginationResize = () => {
  cy.intercept('GET', PAYMENTS_API_ENDPOINT, mockPayments).as('mockPayments');
  testLoadingState();
  cy.wait('@mockPayments');
  cy.viewport('iphone-x'); // 375x812. Will trigger useResizeObserver.
  cy.get('va-pagination')
    .first()
    .shadow()
    .find('li.usa-pagination__item')
    .should($lis => {
      expect($lis).to.have.length(7);
    });
  testAxe();
};

const testNoPayments = () => {
  cy.intercept('GET', PAYMENTS_API_ENDPOINT, mockEmptyPayments).as(
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
    cy.intercept('GET', PAYMENTS_API_ENDPOINT, mockEmptyPaymentsReturned).as(
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
    cy.intercept('GET', PAYMENTS_API_ENDPOINT, mockEmptyPaymentsReceived).as(
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
    cy.intercept(PAYMENTS_API_ENDPOINT, {
      body: mockClientError,
      statusCode: 404,
    }).as('clientError');
    testLoadingState();
    cy.wait('@clientError');
    cy.findByRole('heading', {
      name: 'We don’t have a record of VA payments for you',
    }).should.exist;
  } else {
    cy.intercept(PAYMENTS_API_ENDPOINT, {
      body: mockServerError,
      statusCode: 500,
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
  it('C3916 - Should pass an aXe scan and paginate forwards and backwards through payment data', () => {
    testPagination();
  });
  it('C3917 - Should display an alert when a user has no payment data on file', () => {
    testNoPayments();
  });
  it('C3918 - Should display an alert when a user has payments received but no payments returned to VA', () => {
    testEmptyPaymentsArray('returnPayments');
  });
  it('C3919 - Should display an alert when a user has payments returned to VA but no payments received', () => {
    testEmptyPaymentsArray();
  });
  it('C3920 - Should display an alert when a user receives a 5xx error', () => {
    testApiError();
  });
  it('C3921 - Should display an alert when a user receives a 4xx error', () => {
    testApiError('400');
  });
  it('C3922 - Should resize the pagination correctly for small or zoomed screens', () => {
    testPaginationResize();
  });
});
