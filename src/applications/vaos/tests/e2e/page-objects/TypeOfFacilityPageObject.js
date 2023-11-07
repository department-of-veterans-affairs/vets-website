import PageObject from './PageObject';

export class TypeOfFacilityPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/facility-type', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfFacility(label) {
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new TypeOfFacilityPageObject();
