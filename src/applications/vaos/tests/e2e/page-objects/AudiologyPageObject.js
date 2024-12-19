import PageObject from './PageObject';

export class AudiologyPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'audiology-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfCare(label) {
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .contains(label)
      .click();

    return this;
  }
}

export default new AudiologyPageObject();
