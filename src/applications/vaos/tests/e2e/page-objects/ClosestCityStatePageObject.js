import PageObject from './PageObject';

class ClosestCityStatePageObject extends PageObject {
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
    return super.selectRadioButton(label);
  }
}

export default new ClosestCityStatePageObject();
