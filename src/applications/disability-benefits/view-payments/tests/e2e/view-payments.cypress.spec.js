import mockUser from '../test-user.json';
import mockPayments from '../test-payments-response.json';

const PAYMENTS_PATH = '/va-payment-history/payments';

const testPagination = () => {
  cy.visit(PAYMENTS_PATH);
  cy.findByText(/Your VA payments/i).should('exist');
  cy.findByText(/Loading payment information/i).should('exist');
  cy.findByText(/Loading payment information/i).should('not.exist');
  cy.findByText(/Payments you received/i).should('exist');
  // check a11y
  cy.injectAxe();
  cy.axeCheck();
  // Paginate to next set of data points
  cy.findByText(/Next/i).click();
  cy.findByText(/Displaying 6 - 9 of 9/i).should('exist');
};

describe('View payment history', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login(mockUser);
    cy.route('GET', '/v0/profile/payment_history', mockPayments);
  });
  it('should pass an aXe scan and paginate through payment data', () => {
    testPagination();
  });
});
