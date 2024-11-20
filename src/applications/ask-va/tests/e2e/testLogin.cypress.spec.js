import { mockUser } from './fixtures/user.json';

describe('Ask VA test log in page', () => {
  it('visits landing page of Ask VA ', () => {
    cy.login(mockUser);

    cy.visit('/contact-us/ask-va-too');
    cy.injectAxeThenAxeCheck();

    cy.findByText(`Ask a new question`).should('be.visible');
    cy.findByText(`Ask a new question`).click();

    // Interecept prefill here

    cy.findByText(`Continue`).should('be.visible');
    cy.findByText(`Continue`).click();
  });
});
