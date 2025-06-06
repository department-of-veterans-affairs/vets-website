import PageObject from './PageObject';

class TypeOfEyeCarePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/eye-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfEyeCare(label) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new TypeOfEyeCarePageObject();
