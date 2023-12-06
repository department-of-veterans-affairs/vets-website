import PageObject from './PageObject';

export class TypeOfEyeCarePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/eye-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfEyeCare(label) {
    return this.selectRadioButton(label);
  }
}

export default new TypeOfEyeCarePageObject();
