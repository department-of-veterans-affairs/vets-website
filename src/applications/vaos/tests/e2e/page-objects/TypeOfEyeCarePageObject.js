import PageObject from './PageObject';

export class TypeOfEyeCarePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/eye-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfEyeCare(label) {
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .contains(label)
      .click();

    return this;
  }
}

export default new TypeOfEyeCarePageObject();
