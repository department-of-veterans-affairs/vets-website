import PageObject from './PageObject';

export class ClosestCityStatePageObject extends PageObject {
  assertHeading({ name }) {
    return this.assertShadow({
      element: 'va-radio',
      text: name,
    });
  }

  assertUrl() {
    cy.url().should('include', 'closest-city');
    cy.axeCheckBestPractice();

    return this;
  }

  selectFacility({ label }) {
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .findByText(label)
      .click();

    return this;
  }
}

export default new ClosestCityStatePageObject();
