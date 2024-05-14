import PageObject from './PageObject';

export class SecondDosePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/second-dose');
    cy.axeCheckBestPractice();

    return this;
  }
}

export default new SecondDosePageObject();
