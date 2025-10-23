import PageObject from './PageObject';

class TypeOfVisitPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/preferred-method');
    cy.axeCheckBestPractice();

    return this;
  }

  assertTypeOfVisitValidationErrors() {
    this.clickNextButton();
    this.assertValidationError('Select an option');

    return this;
  }

  selectVisitType(label) {
    return super.selectRadioButton(label);
  }
}

export default new TypeOfVisitPageObject();
