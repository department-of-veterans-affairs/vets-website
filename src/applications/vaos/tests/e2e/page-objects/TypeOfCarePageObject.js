import PageObject from './PageObject';

class TypeOfCarePageObject extends PageObject {
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
    cy.url().should('include', '/type-of-care');
    this.assertLink({ name: 'Back', useShadowDOM: true });

    return this;
  }

  selectTypeOfCare(label) {
    this.selectRadioButton(label);
    return this;
  }
}

export default new TypeOfCarePageObject();
