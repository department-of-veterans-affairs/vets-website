import PageObject from './PageObject';

class AudiologyPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'audiology-care');
    cy.axeCheckBestPractice();

    return this;
  }

  assertAudiologyValidationErrors() {
    this.clickNextButton();
    this.assertValidationErrorShadow('You must provide a response');
    return this;
  }

  selectTypeOfCare(label) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new AudiologyPageObject();
