import Timeouts from 'platform/testing/e2e/timeouts';
import PageObject from './PageObject';

class TypeOfCarePage extends PageObject {
  assertUrl() {
    cy.url().should('include', '/type-of-care', { timeout: Timeouts.slow });
    cy.axeCheckBestPractice();
    return this;
  }

  selectTypeOfCare(label) {
    cy.findByLabelText(label)
      .as('radio')
      .focus();
    cy.get('@radio').check();

    return this;
  }
}

export default new TypeOfCarePage();
