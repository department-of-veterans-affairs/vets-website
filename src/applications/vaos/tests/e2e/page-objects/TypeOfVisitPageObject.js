import PageObject from './PageObject';

export class TypeOfVisitPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/preferred-method');
    cy.axeCheckBestPractice();

    return this;
  }

  selectVisitType(label) {
    return this.selectRadioButton(label);
  }
}

export default new TypeOfVisitPageObject();
