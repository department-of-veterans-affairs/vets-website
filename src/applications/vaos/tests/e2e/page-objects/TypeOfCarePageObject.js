import PageObject from './PageObject';

export class TypeOfCarePageObject extends PageObject {
  assertAddressAlert({ exist = true } = {}) {
    if (exist) {
      cy.get('va-alert[status=warning]')
        .as('alert')
        .shadow();
      cy.get('@alert').contains(
        /To use some of the tool.s features, you need a home address on file/i,
      );
    } else {
      cy.get('va-alert[status=warning]').should('not.exist');
    }

    return this;
  }

  assertUrl() {
    cy.url().should('include', '/type-of-care', { timeout: 5000 });
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

export default new TypeOfCarePageObject();
