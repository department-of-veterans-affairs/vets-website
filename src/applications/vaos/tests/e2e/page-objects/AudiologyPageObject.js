import PageObject from './PageObject';

class AudiologyPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'audiology-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfCare(label) {
    return super.selectRadioButtonShadow(label);
  }
}

export default new AudiologyPageObject();
