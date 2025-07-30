import PageObject from './PageObject';

class ScheduleCernerPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/how-to-schedule');
    cy.axeCheckBestPractice();

    return this;
  }
}

export default new ScheduleCernerPageObject();
