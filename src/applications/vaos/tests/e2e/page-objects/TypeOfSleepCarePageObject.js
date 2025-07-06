import PageObject from './PageObject';

class TypeOfSleepCarePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/sleep-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfSleepCare(label) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new TypeOfSleepCarePageObject();
