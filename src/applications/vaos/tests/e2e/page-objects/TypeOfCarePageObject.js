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
    return super.assertUrl(
      {
        url: '/type-of-care',
        breadcrumb: 'What type of care do you need?',
      },
      { timeout: 10000 },
    );
  }

  selectTypeOfCare(label) {
    this.selectRadioButton(label);
    return this;
  }
}

export default new TypeOfCarePageObject();
