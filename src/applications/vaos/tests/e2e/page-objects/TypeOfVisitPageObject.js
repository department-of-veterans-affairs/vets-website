import PageObject from './PageObject';

export class TypeOfVisitPageObject extends PageObject {
  assertHeading({ name }) {
    return this.assertShadow({
      element: 'va-radio',
      text: name,
    });
  }

  assertUrl() {
    cy.url().should('include', '/preferred-method');
    cy.axeCheckBestPractice();

    return this;
  }

  selectVisitType(label) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new TypeOfVisitPageObject();
