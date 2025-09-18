import PageObject from './PageObject';

class TypeOfFacilityPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/facility-type', { timeout: 5000 });
    cy.axeCheckBestPractice();
    cy.wait('@v2:get:facilities');

    return this;
  }

  assertTypeOfFacilityValidationErrors() {
    this.clickNextButton();
    this.assertValidationError('You must provide a response');

    return this;
  }

  selectTypeOfFacility(label) {
    return super.selectRadioButton(label);
  }
}

export default new TypeOfFacilityPageObject();
