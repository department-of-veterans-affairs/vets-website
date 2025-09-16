import PageObject from './PageObject';

class TypeOfEyeCarePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/eye-care');
    cy.axeCheckBestPractice();

    return this;
  }

  assertTypeOfEyeCareValidationErrors() {
    this.clickNextButton();
    this.assertValidationErrorShadow('You must provide a response');

    return this;
  }

  selectTypeOfEyeCare(label) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new TypeOfEyeCarePageObject();
