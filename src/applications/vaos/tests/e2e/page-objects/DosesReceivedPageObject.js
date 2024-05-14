import PageObject from './PageObject';

export class DosesReceivedPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'doses-received');
    cy.axeCheckBestPractice();

    return this;
  }

  // TODO: Move to PageObject?
  selectRadioButton(label) {
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new DosesReceivedPageObject();
