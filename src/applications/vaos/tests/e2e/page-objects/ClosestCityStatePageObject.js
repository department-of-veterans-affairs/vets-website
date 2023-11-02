import PageObject from './PageObject';

export class ClosestCityStatePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'closest-city');
    cy.axeCheckBestPractice();

    return this;
  }

  selectFacility() {
    cy.findByLabelText(/cheyenne/i).check();
    return this;
  }
}

export default new ClosestCityStatePageObject();
