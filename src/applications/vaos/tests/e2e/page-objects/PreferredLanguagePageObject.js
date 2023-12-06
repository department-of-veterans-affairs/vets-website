import PageObject from './PageObject';

export class PreferredLanguagePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'preferred-language');
    cy.axeCheckBestPractice();

    return this;
  }

  selectLanguage(string) {
    // Select preferred language
    cy.get('#root_preferredLanguage').select(string);
    cy.get('#root_preferredLanguage').should('have.value', string);

    return this;
  }
}

export default new PreferredLanguagePageObject();
