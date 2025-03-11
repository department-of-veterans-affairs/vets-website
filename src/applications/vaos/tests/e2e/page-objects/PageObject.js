export default class PageObject {
  rootUrl = '/my-health/appointments';

  assertAlert({ text, exist, status }) {
    cy.get(`va-alert[status=${status}]`)
      .as('alert')
      .shadow();
    cy.get('@alert')
      .contains(text)
      .should(exist ? 'exist' : 'not.exist');

    return this;
  }

  assertButton({ label, exist = true, isEnabled = true } = {}) {
    if (exist) {
      cy.contains('button', label)
        .as('button')
        .should(isEnabled ? 'be.enabled' : 'be.disabled');
    } else {
      cy.contains('button', label).should('not.exist');
    }

    return this;
  }

  assertCallCount({ alias, count }) {
    cy.get(`${alias}.all`).then(calls => {
      cy.wrap(calls.length).should('equal', count);
    });

    return this;
  }

  assertErrorAlert({ text, exist = true }) {
    return this.assertAlert({ text, exist, status: 'error' });
  }

  /**
   *
   *
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {string|RegExp=} props.name - Set video appointment URL.
   * @param {number=} props.level - Set video appointment URL.
   * @returns
   * @memberof PageObject
   */
  assertHeading({ name, level = 1, exist = true } = {}) {
    cy.findByRole('heading', { level, name }).should(
      exist ? 'exist' : 'not.exist',
    );

    return this;
  }

  assertLink({ name, exist = true } = {}) {
    cy.findByRole('link', { name }).should(exist ? 'exist' : 'not.exist');
    return this;
  }

  assertModal({ text, exist, status }) {
    cy.get(`va-modal[status=${status}]`)
      .as('modal')
      .shadow();
    cy.get('@modal')
      .contains(text)
      .should(exist ? 'exist' : 'not.exist');

    return this;
  }

  assertNextButton({ isEnabled = true, label = 'Continue' } = {}) {
    cy.contains('button', label)
      .as('button')
      .should(isEnabled ? 'be.enabled' : 'be.disabled');

    return this;
  }

  assertShadow({ element, text, exist = true } = {}) {
    cy.get(element)
      .shadow()
      .findByText(text)
      .should(exist ? 'exist' : 'not.exist');

    return this;
  }

  /**
   *
   *
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {string|RegExp=} props.text - Text to assert.
   * @param {boolean=} props.exist - True or false.
   * @returns
   * @memberof PageObject
   */
  assertText({ text, exist = true } = {}) {
    cy.get('va-loading-indicator.hydrated', { timeout: 120000 }).should(
      'not.exist',
    );

    cy.findByText(text).should(exist ? 'exist' : 'not.exist');
    return this;
  }

  assertUrl({ url, breadcrumb }) {
    cy.get('va-loading-indicator.hydrated', { timeout: 240000 }).should(
      'not.exist',
    );

    cy.url().should('include', url);
    cy.get('va-breadcrumbs')
      .shadow()
      .find('a')
      .contains(breadcrumb);

    cy.axeCheckBestPractice();

    return this;
  }

  assertWarningAlert({ text, exist = true }) {
    return this.assertAlert({ text, exist, status: 'warning' });
  }

  assertWarningModal({ text, exist = true }) {
    return this.assertModal({ text, exist, status: 'warning' });
  }

  clickBackButton(label = 'Back') {
    return this.clickButton({ label });
  }

  clickButton({ label }) {
    cy.contains('button', label)
      .as('button')
      .should('not.be.disabled');
    cy.get('@button').focus();
    cy.get('@button').click({ waitForAnimations: true });

    return this;
  }

  clickNextButton(label = 'Continue') {
    return this.clickButton({ label });
  }

  selectRadioButton(label) {
    cy.findByLabelText(label).as('radio');
    cy.get('@radio').check();

    return this;
  }

  selectRadioButtonShadow(label) {
    cy.get('va-radio')
      .shadow()
      .get('va-radio-option')
      .contains(label)
      .click();

    return this;
  }

  visit(url = '', options = {}) {
    const normalizedUrl = `${this.rootUrl}/${url.replace(/^\//, '')}`;

    if (Object.keys(options).length) cy.visit(normalizedUrl, options);
    else cy.visit(normalizedUrl);

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

  wait({ alias }) {
    cy.wait(`${alias}`);
    return this;
  }
}
