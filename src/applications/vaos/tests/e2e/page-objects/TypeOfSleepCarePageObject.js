import PageObject from './PageObject';

class TypeOfSleepCarePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/sleep-care');
    cy.axeCheckBestPractice();

    return this;
  }

  assertTypeOfSleepCareValidationErrors() {
    this.clickNextButton();
    this.assertValidationError('You must provide a response');

    return this;
  }

  selectTypeOfSleepCare(label) {
    return super.selectRadioButton(label);
  }
}

export default new TypeOfSleepCarePageObject();
