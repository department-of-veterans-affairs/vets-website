import PageObject from './PageObject';

class TypeOfMentalHealthPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/mental-health');
    cy.axeCheckBestPractice();

    return this;
  }

  assertTypeOfMentalHealthValidationErrors() {
    this.clickNextButton();
    this.assertValidationError('You must provide a response');

    return this;
  }

  selectTypeOfMentalHealth(label) {
    return super.selectRadioButton(label);
  }
}

export default new TypeOfMentalHealthPageObject();
