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
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .findByText(label)
      .click();

    return this;
  }
}

export default new TypeOfVisitPageObject();
