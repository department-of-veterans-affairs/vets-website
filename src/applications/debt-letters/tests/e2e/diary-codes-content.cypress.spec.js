import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Diary Codes', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
    cy.axeCheck();
  });

  it.skip('renders expected content for diary code: 080', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Referred to the Department of the Treasury',
    );
    cy.get('[data-testid="diary-code-080-nextstep"]').should(
      'have.text',
      "Next step: Call the U.S. Department of the Treasury's Debt Management Center at 888-826-3127, 8:30 a.m. to 6:30 p.m. ET. Don't send us payment directly. This will delay posting of payment to your account. And the Treasury Department may continue adding fees and interest.",
    );
  });

  it.skip('renders expected content for diary code: 100', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Pending payment',
    );
    cy.get('[data-testid="diary-code-100-nextstep"]').should(
      'have.text',
      'Next step: Please pay now or contact us to start making payments again to avoid collection actions. You can contact us through IRIS or call us at 800-827-0648 (or +1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. Review payment options',
    );
  });

  it.skip('renders expected content for diary code: 101, 450, 610, 617', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Pending automatic benefit offset',
    );
    cy.get('[data-testid="diary-code-101-nextstep"]').should(
      'have.text',
      "Next step: We'll keep offsetting your benefits each month until your debt is paid in full. If you'd like to pay in full now, please call us first to make sure you don't overpay. If you stop receiving VA benefits, call us to set up a new payment plan. We're here at 800-827-0648 (or +1-612-713-6415 from overseas), Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.",
    );
  });

  it.skip('renders expected content for diary code: 117', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Pending payment',
    );
    cy.get('[data-testid="diary-code-117-nextstep"]').should(
      'have.text',
      'Next step: Please pay now or contact us about payment options by  May 31st, 2017, to avoid additional collection action. These include having your debt reported to credit reporting agencies or referred to the U.S. Department of the Treasury.You can contact us through IRIS or call us at 800-827-0648 (or +1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. Review payment options',
    );
  });

  it.skip('renders expected content for diary code: 123', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Pending payment',
    );
    cy.get('[data-testid="diary-code-123-nextstep"]').should(
      'have.text',
      "Next step: Please pay now or contact us about payment options by  October 7th, 2018, to avoid collection actions. If you don't pay or make other arrangements with us by this date, we're required by law to refer your debt to the U.S. Department of the Treasury.You can contact us through IRIS or call us at 800-827-0648 (or +1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. Review payment options",
    );
  });

  it.skip('renders expected content for diary code: 500', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Debt is pending referral to the Department of the Treasury',
    );
    cy.get('[data-testid="diary-code-500-nextstep"]').should(
      'have.text',
      "Next step: Please pay the full amount online or by phone now to prevent referral. If we don't receive your payment today we're required by law to refer your debt to the U.S. Department of the Treasury.Pay online nowOr make a payment over the phone at 800-827-0648 (or +1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.",
    );
  });

  it.skip('renders expected content for diary code: 600, 601', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Pending payment',
    );
    cy.get('[data-testid="diary-code-600-nextstep"]').should(
      'have.text',
      "Next step: Please continue to make payments. If you begin receiving VA benefits, call us to set up an automatic payment plan. We'll keep part of your benefit amount each month to pay your debt. We're here at 800-827-0648 (or +1-612-713-6415 from overseas), Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.",
    );
  });
});
