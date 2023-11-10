import PageObject from './PageObject';

export class PlanAheadPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'covid-vaccine');
    cy.axeCheckBestPractice();

    return this;
  }
}

export default new PlanAheadPageObject();
