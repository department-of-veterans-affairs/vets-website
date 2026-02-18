import PageObject from './PageObject';

class ProviderPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/provider');
    cy.axeCheckBestPractice();
    return this;
  }
}

export default new ProviderPageObject();
