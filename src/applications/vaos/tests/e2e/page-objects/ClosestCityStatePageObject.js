import PageObject from './PageObject';

class ClosestCityStatePageObject extends PageObject {
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

  assertClosestCityStateValidationErrors() {
    this.clickNextButton();
    this.assertValidationError('Select a city');

    return this;
  }

  selectFacility({ label }) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new ClosestCityStatePageObject();
