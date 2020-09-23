import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Debt Letters', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
  });

  it('displays the current debts section and navigates to debt details', () => {
    cy.visit('/manage-va-debt/your-debt/');
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.findByText(/Go to debt details/i, { selector: 'a' }).click();
    cy.get('#debtLetterHistory').contains('Debt letter history');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays download debt letters', () => {
    cy.visit('/manage-va-debt/your-debt/');
    cy.findByText(/Download debt letters/i, { selector: 'a' }).click();
    cy.findByText(/Download letters related to your va debt/i, {
      selector: 'a',
    }).click();
    cy.get('#downloadDebtLetters').contains('Download debt letters');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays how do I pay my VA debt?', () => {
    cy.visit('/manage-va-debt/your-debt/');
    cy.findByText(/How do I pay my VA debt/i, { selector: 'a' }).click();
    cy.get('#howDoIPay').contains('How do I pay my VA debt?');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays how do I get financial help?', () => {
    cy.visit('/manage-va-debt/your-debt/');
    cy.findByText(/How do I get financial help/i, { selector: 'a' }).click();
    cy.get('#howDoIGetHelp').contains('How do I get financial help?');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays how do I dispute a debt?', () => {
    cy.visit('/manage-va-debt/your-debt/');
    cy.findByText(/How do I dispute a debt?/i, { selector: 'a' }).click();
    cy.get('#howDoIDispute').contains('How do I dispute a debt?');
    cy.injectAxe();
    cy.axeCheck();
  });
});
