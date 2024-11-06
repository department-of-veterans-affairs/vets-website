import PageObject from './PageObject';

export class TypeOfFacilityPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/facility-type', { timeout: 5000 });
    cy.axeCheckBestPractice();
    cy.wait('@v2:get:facilities');

    return this;
  }

  selectTypeOfFacility(label) {
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .contains(label)
      .click();

    return this;
  }
}

export default new TypeOfFacilityPageObject();
