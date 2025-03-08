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
    return super.selectRadioButtonShadow(label);
  }
}

export default new ClosestCityStatePageObject();
