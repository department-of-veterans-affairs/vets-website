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

  /**
   * Method to assert a button.
   *
   * @param {Object} params
   * @param {string|RegExp} [params.label] Button label
   * @param {boolean} [params.exist=true] Assert on existence or non-existence
   * @param {boolean} [params.isEnabled=true] Assert if button is enabled or not
   *
   * @returns
   * @memberof PageObject
   */
  assertButton({ label, exist = true, isEnabled = true }) {
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

  assertCrisisModal() {
    cy.get(`#modal-crisisline`).as('alert');
    cy.get('@alert').contains('We’re here anytime, day or night – 24/7');
    return this;
  }

  assertErrorAlert({ text, exist = true }) {
    return this.assertAlert({ text, exist, status: 'error' });
  }

  assertValidationError(error) {
    cy.get(`span[role="alert"]`).as('alert');
    cy.get('@alert')
      .contains(error)
      .should('exist');
    return this;
  }

  assertValidationErrorShadow(error) {
    cy.get(`[error="${error}"]`).should('exist');
    return this;
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

  /**
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {Object=} props.name - Name of the link.
   * @param {Object=} props.exist - Assert if the link exists or not.
   * @param {Object=} props.useShadowDOM - Search shadow DOM for the link.
   *
   * @returns
   * @memberof PageObject
   */
  assertLink({ name, exist = true, useShadowDOM = false } = {}) {
    if (useShadowDOM) {
      cy.get('va-link')
        .as('link')
        .shadow();
      cy.get('@link')
        .contains(name)
        .should(exist ? 'exist' : 'not.exist');
    } else {
      cy.findByRole('link', { name }).should(exist ? 'exist' : 'not.exist');
    }

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
    cy.get('va-loading-indicator.hydrated', {
      timeout: 120000,
    }).should('not.exist');

    cy.findByText(text).should(exist ? 'exist' : 'not.exist');
    return this;
  }

  /**
   * Asserts that the text exists in the DOM but between a min and max number of occurrences.
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {string|RegExp=} props.text - Text to assert.
   * @param {number} [props.minNumber=-1] - Minimum number (inclusive) of occurrences to assert. Default, at least one
   * @param {number} [props.maxNumber=-1] - Maximum number (exclusive) of occurrences to assert. Default, any number
   * @returns
   * @memberof PageObject
   */
  assertSomeText({ text, minNumber = 1, maxNumber = -1 } = {}) {
    cy.get('va-loading-indicator.hydrated', {
      timeout: 120000,
    }).should('not.exist');
    cy.findAllByText(text).then($found => {
      expect($found).to.have.length.gte(minNumber);
      if (maxNumber > 0) {
        expect($found).to.have.length.lt(maxNumber);
      }
    });
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

  clickButton({ ariaLabel, label, shadow = false }) {
    if (shadow) {
      cy.get('va-button')
        .shadow()
        .contains(label)
        .click();

      return this;
    }

    if (ariaLabel) {
      cy.get(`[aria-label="${ariaLabel}"]`)
        .as('button')
        .should('not.be.disabled');
    } else {
      cy.contains('button', label)
        .as('button')
        .should('not.be.disabled');
    }

    cy.get('@button').focus();
    cy.get('@button').click({ waitForAnimations: true });

    return this;
  }

  clickLink({ name, useShadowDOM = false }) {
    if (useShadowDOM) {
      cy.get('va-link')
        .as('link')
        .shadow();
      cy.get('@link')
        .contains(name)
        .click();
    } else {
      cy.findByRole('link', { name }).click({ waitForAnimations: true });
    }

    return this;
  }

  clickNextButton(label = 'Continue') {
    return this.clickButton({ label });
  }

  scheduleAppointment(text = 'Start scheduling an appointment') {
    cy.findByText(text).click({ waitForAnimations: true });
    return this;
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
