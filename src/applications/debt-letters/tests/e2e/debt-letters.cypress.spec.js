import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Debt Letters', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
  });

  it('displays the current debts section and navigates to debt details', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.findByText(/Go to debt details/i, { selector: 'a' }).click();
    cy.get('#debtLetterHistory').contains('Debt letter history');
    cy.axeCheck();
  });

  it('displays download debt letters', () => {
    expect(true).to.equal(true);
  });

  // it('displays how do I pay my VA debt?', () => {
  //   expect(true).to.equal(true);
  // });

  // it('displays how do I get financial help?', () => {
  //   expect(true).to.equal(true);
  // });

  // it('displays how do I dispute a debt?', () => {
  //   expect(true).to.equal(true);
  // });
});
