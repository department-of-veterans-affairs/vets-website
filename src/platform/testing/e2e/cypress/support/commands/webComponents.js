const FORCE_OPTION = { force: true };

Cypress.Commands.add('fillVaTextInput', (field, value) => {
  if (value) {
    const strValue = value.toString();
    const element =
      typeof field === 'string'
        ? cy.get(`va-text-input[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('input')
      .as('currentElement')
      .clear({ force: true })
      .type(strValue, { force: true });

    cy.get('@currentElement').should('have.value', strValue);
  }
});

Cypress.Commands.add('fillVaTextarea', (field, value) => {
  if (value) {
    const strValue = value.toString();
    const element =
      typeof field === 'string'
        ? cy.get(`va-textarea[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('textarea')
      .as('currentElement')
      .clear({ force: true })
      .type(strValue, { force: true });

    cy.get('@currentElement').should('have.value', strValue);
  }
});

Cypress.Commands.add('selectVaRadioOption', (field, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-radio-option[name="${field}"][value="${value}"]`)
      .as('currentElement')
      .click();
    cy.get('@currentElement').should('have.attr', 'checked');
  }
});

Cypress.Commands.add('selectYesNoVaRadioOption', (field, value) => {
  if (typeof value !== 'undefined') {
    const selection = value ? 'Y' : 'N';
    cy.selectVaRadioOption(field, selection);
  }
});

Cypress.Commands.add('selectVaSelect', (field, value) => {
  if (typeof value !== 'undefined') {
    const strValue = value.toString();
    const element =
      typeof field === 'string'
        ? cy.get(`va-select[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('select')
      .as('currentElement')
      .select(strValue, FORCE_OPTION);
    cy.get('@currentElement').should('have.value', strValue);
  }
});

Cypress.Commands.add('selectVaCheckbox', (field, isChecked) => {
  if (typeof isChecked !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-checkbox[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('input')
      .as('currentElement');

    if (isChecked) {
      cy.get('@currentElement').check(FORCE_OPTION);
      cy.get('@currentElement').should('be.checked');
    } else {
      cy.get('@currentElement').uncheck(FORCE_OPTION);
      cy.get('@currentElement').should('not.be.checked');
    }
  }
});

Cypress.Commands.add('fillVaDate', (field, dateString, monthYearOnly) => {
  if (dateString) {
    const element =
      typeof field === 'string'
        ? cy.get(`va-date[name="${field}"]`)
        : cy.wrap(field);

    const [year, month, day] = dateString.split('-').map(
      dateComponent =>
        // eslint-disable-next-line no-restricted-globals
        isFinite(dateComponent)
          ? parseInt(dateComponent, 10).toString()
          : dateComponent,
    );

    element.shadow().then(el => {
      cy.wrap(el)
        .find('va-select.select-month')
        .shadow()
        .find('select')
        .select(month);
      if (!monthYearOnly) {
        cy.wrap(el)
          .find('va-select.select-day')
          .shadow()
          .find('select')
          .select(day);
      }
      cy.wrap(el)
        .find('va-text-input.input-year')
        .shadow()
        .find('input')
        .type(year);
    });
  }
});

Cypress.Commands.add(
  'fillVaMemorableDate',
  (field, dateString, useMonthSelect = true) => {
    if (dateString) {
      const element =
        typeof field === 'string'
          ? cy.get(`va-memorable-date[name="${field}"]`)
          : cy.wrap(field);

      const [year, month, day] = dateString.split('-').map(
        dateComponent =>
          // eslint-disable-next-line no-restricted-globals
          isFinite(dateComponent)
            ? parseInt(dateComponent, 10).toString()
            : dateComponent,
      );

      element.shadow().then(el => {
        // There is a bug only on Chromium based browsers where
        // VaMemorableDate text input fields will think they are
        // disabled if you blur focus of the window while the test
        // is running. realPress and realType solve this issue,
        // but these are only available for Chromium based browsers.
        // See cypress-real-events npmjs for more info.
        // ** see applications/simple-forms/shared/tests/e2e/helpers.js **
        const isChrome = navigator.userAgent.includes('Chrome');
        const getSelectors = type =>
          `va-text-input.input-${type}, va-text-input.usa-form-group--${type}-input`;

        // month
        if (useMonthSelect) {
          cy.wrap(el)
            .find('va-select.usa-form-group--month-select')
            .shadow()
            .find('select')
            .select(month);
        } else if (isChrome) {
          cy.wrap(el)
            .find(getSelectors('month'))
            .shadow()
            .find('input')
            .focus();
          cy.realType(month);
        } else {
          cy.wrap(el)
            .find(getSelectors('month'))
            .shadow()
            .find('input')
            .type(month);
        }

        // day and year
        if (isChrome) {
          cy.realPress('Tab')
            .realType(day)
            .realPress('Tab')
            .realType(year);
        } else {
          cy.wrap(el)
            .find(getSelectors('day'))
            .shadow()
            .find('input')
            .type(day);
          cy.wrap(el)
            .find(getSelectors('year'))
            .shadow()
            .find('input')
            .type(year);
        }
      });
    }
  },
);

Cypress.Commands.add('enterWebComponentData', field => {
  switch (field.tagName) {
    case 'VA-TEXT-INPUT': {
      cy.fillVaTextInput(field.element, field.data);
      break;
    }

    case 'VA-TEXTAREA': {
      cy.fillVaTextarea(field.element, field.data);
      break;
    }

    case 'VA-CHECKBOX': {
      cy.selectVaCheckbox(field.element, field.data);
      break;
    }

    case 'VA-SELECT': {
      cy.selectVaSelect(field.element, field.data);
      break;
    }

    case 'VA-DATE': {
      cy.fillVaDate(field.element, field.data);
      break;
    }

    case 'VA-RADIO-OPTION': {
      const value = field.data;
      if (typeof value !== 'undefined') {
        if (typeof value === 'boolean') {
          cy.selectYesNoVaRadioOption(field.key, value);
        } else {
          cy.selectVaRadioOption(field.key, value);
        }
      }
      break;
    }

    case 'VA-MEMORABLE-DATE': {
      cy.fillVaMemorableDate(field.key, field.data);
      break;
    }

    default:
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
  }
});
