import PageObject from './PageObject';

export class AudiologyPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'audiology-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfCare(label) {
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').click();

    return this;
  }
}

export default new AudiologyPageObject();
