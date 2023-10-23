export default class PageObject {
  rootUrl = '/my-health/appointments';

  clickNextButton(label = 'Continue') {
    cy.contains('button', label)
      .as('button')
      .should('not.be.disabled');
    cy.get('@button').focus();
    cy.get('@button').click({ waitForAnimations: true });

    return this;
  }

  visit(url = '') {
    cy.visit(`${this.rootUrl}/${url.replace(/^\//, '')}`);
    cy.injectAxe();

    return this;
  }

  validate() {
    this._validateUrl();
    this._validateHeader();
    return this;
  }

  _validateUrl() {
    return this;
  }

  _validateHeader() {
    return this;
  }
}
