import PageObject from './PageObject';

class ClosestCity extends PageObject {
  assertUrl() {
    cy.url().should('include', 'closest-city');
    cy.axeCheckBestPractice();

    return this;
  }

  selectFacility() {
    cy.findByLabelText(/cheyenne/i).click();
    return this;
  }
}

export default new ClosestCity();
