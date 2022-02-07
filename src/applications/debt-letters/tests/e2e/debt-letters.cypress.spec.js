import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe.skip('Debt Letters', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/debts', mockDebts);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
  });

  it('C1033 displays the current debts section and navigates to debt details', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('.usa-button')
      .contains('Go to debt details')
      .first()
      .click();
    cy.get('#debtLetterHistory').contains('Debt letter history');
    cy.axeCheck();
  });

  it('C1034 displays download debt letters', () => {
    cy.findByText(/Download debt letters/i, { selector: 'a' }).click();
    cy.findByText(/Download letters related to your va debt/i, {
      selector: 'a',
    }).click();
    cy.get('#downloadDebtLetters').contains('Download debt letters');
    cy.axeCheck();
  });

  it('C1035 displays how do I pay my VA debt?', () => {
    cy.findByText(/How do I pay my VA debt/i, { selector: 'a' }).click();
    cy.get('#howDoIPay').contains('How do I pay my VA debt?');
    cy.axeCheck();
  });

  it('C1036 displays how do I get financial help?', () => {
    cy.findByText(/How do I get financial help/i, { selector: 'a' }).click();
    cy.get('#howDoIGetHelp').contains('How do I get financial help?');
    cy.axeCheck();
  });

  it('C1037 displays how do I dispute a debt?', () => {
    cy.findByText(/How do I dispute a debt?/i, { selector: 'a' }).click();
    cy.get('#howDoIDispute').contains('How do I dispute a debt?');
    cy.axeCheck();
  });
});
