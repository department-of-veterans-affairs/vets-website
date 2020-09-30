import mockUser from '../test-user.json';
import { payments } from '../helpers';

const PAYMENTS_PATH = '/va-payment-history/payments';

const testPagination = () => {
  cy.visit(PAYMENTS_PATH);
};

describe('View payment history', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login(mockUser);
    cy.route('GET', '/v0/profile/payment_history', payments);
  });
  it('should pass an aXe scan and paginate through payment data', () => {
    testPagination();
  });
});
