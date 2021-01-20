import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Debt Letters', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
    cy.axeCheck();
  });

  it.skip('C1033 displays the current debts section and navigates to debt details', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('.usa-button')
      .contains('Go to debt details')
      .first()
      .click();
    cy.get('#debtLetterHistory').contains('Debt letter history');
  });

  it.skip('C1034 displays download debt letters', () => {
    cy.findByText(/Download debt letters/i, { selector: 'a' }).click();
    cy.findByText(/Download letters related to your va debt/i, {
      selector: 'a',
    }).click();
    cy.get('#downloadDebtLetters').contains('Download debt letters');
  });

  it.skip('C1035 displays how do I pay my VA debt?', () => {
    cy.findByText(/How do I pay my VA debt/i, { selector: 'a' }).click();
    cy.get('#howDoIPay').contains('How do I pay my VA debt?');
  });

  it.skip('C1036 displays how do I get financial help?', () => {
    cy.findByText(/How do I get financial help/i, { selector: 'a' }).click();
    cy.get('#howDoIGetHelp').contains('How do I get financial help?');
  });

  it.skip('C1037 displays how do I dispute a debt?', () => {
    cy.findByText(/How do I dispute a debt?/i, { selector: 'a' }).click();
    cy.get('#howDoIDispute').contains('How do I dispute a debt?');
  });
});
