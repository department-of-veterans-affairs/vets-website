import PageObject from './PageObject';

class ReviewPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/review');
    cy.axeCheckBestPractice();

    return this;
  }

  clickConfirmButton() {
    cy.findByText('Confirm appointment').click();

    return this;
  }
}

export default new ReviewPageObject();
