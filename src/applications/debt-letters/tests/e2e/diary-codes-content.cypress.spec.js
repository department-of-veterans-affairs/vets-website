import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Diary Codes', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/debts', mockDebts);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
  });

  it('renders expected content for diary code: 080, 850, 852, 860, 855', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: We referred this debt to the U.S. Department of the Treasury.',
    );
    cy.get('[data-testid="diary-code-080-next-step"]').should(
      'have.text',
      'Next step: Call the U.S. Department of the Treasury’s Debt Management Center at888-826-3127, 8:30 a.m. to 6:30 p.m. ET. Don’t send us payment directly. This will delay posting of payment to your account. And the Treasury Department may continue adding fees and interest.',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 100, 102, 130, 140', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Your payment is due now.',
    );
    cy.get('[data-testid="diary-code-100-next-step"]').should(
      'have.text',
      'Next step: Please pay now or contact us to start making payments again to avoid collection actions. You cancontact us online through Ask VAor call us at 800-827-0648 (or+1-612-713-6415from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.Review payment options',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 101, 602, 607, 608, 610, 611, 614, 615, 617', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: We’re keeping part of yourCH33 Housing EDUpayments each month to pay your debt (called monthly offsets).',
    );
    cy.get('[data-testid="diary-code-608-next-step"]').should(
      'have.text',
      'Next step: We’ll keep offsetting your benefits each month until your debt is paid in full. If you’d like to pay in full now, please call us first to make sure you don’t overpay. If you stop receiving VA benefits, call us to set up a new payment plan. We’re here at800-827-0648 (or+1-612-713-6415from overseas), Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 117', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Your payment is past due.',
    );
    cy.get('[data-testid="diary-code-117-next-step"]').should(
      'have.text',
      'Next step: Please pay now or contact us about payment options byMay 31st, 2017,to avoid additional collection action. These include having your debt reported to credit reporting agencies or referred to the U.S. Department of the Treasury.You cancontact us online through Ask VAor call us at 800-827-0648 (or+1-612-713-6415from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.Review payment options',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 123', () => {
    cy.get('[data-testid="diary-codes-status"]').contains(
      'Status: Your payment is past due.',
    );
    cy.get('[data-testid="diary-code-123-next-step"]').should(
      'have.text',
      'Next step: Please pay now or contact us about payment options byOctober 7th, 2018,to avoid collection actions. If you don’t pay or make other arrangements with us by this date, we’re required by law to refer your debt to the U.S. Department of the Treasury.You cancontact us online through Ask VAor call us at 800-827-0648 (or+1-612-713-6415from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.Review payment options',
    );
    cy.axeCheck();
  });
});
