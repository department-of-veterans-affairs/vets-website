const FORCE_OPTION = { force: true };

Cypress.Commands.add('fillTextWebComponent', (field, value) => {
  if (value) {
    const element =
      typeof field === 'string'
        ? cy.get(`va-text-input[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('input')
      .as('currentElement')
      .type(value);

    cy.get('@currentElement').then(el => {
      if (el.val()) cy.get(el).should('have.value', value);
    });
  }
});

Cypress.Commands.add('fillTextAreaWebComponent', (field, value) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-textarea[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('textarea')
      .as('currentElement')
      .type(value);

    cy.get('@currentElement').then(el => {
      if (el.val()) cy.get(el).should('have.value', value);
    });
  }
});

Cypress.Commands.add('selectRadioWebComponent', (field, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-radio-option[name="${field}"][value="${value}"]`)
      .as('currentElement')
      .click();
    cy.get('@currentElement').should('have.attr', 'checked');
  }
});

Cypress.Commands.add('selectYesNoWebComponent', (field, value) => {
  const selection = value ? 'Y' : 'N';
  cy.selectRadioWebComponent(field, selection);
});

Cypress.Commands.add('selectDropdownWebComponent', (field, value) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-select[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('select')
      .as('currentElement')
      .select(value, FORCE_OPTION);
    cy.get('@currentElement').should('have.value', value);
  }
});

Cypress.Commands.add('selectCheckboxWebComponent', (field, isChecked) => {
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
});

Cypress.Commands.add('fillMemorableDateWebComponent', (field, value) => {
  // eslint-disable-next-line cypress/no-assigning-return-values
  const element = cy.get(`va-memorable-date[name="${field}"]`);

  const [year, month, day] = value.split('-').map(
    dateComponent =>
      // eslint-disable-next-line no-restricted-globals
      isFinite(dateComponent)
        ? parseInt(dateComponent, 10).toString()
        : dateComponent,
  );

  if (navigator.userAgent.includes('Chrome')) {
    // There is a bug only on Chromium based browsers where
    // VaMemorableDate text input fields will think they are
    // disabled if you blur focus of the window while the test
    // is running. realPress and realType solve this issue,
    // but these are only available for Chromium based browsers.
    // See cypress-real-events npmjs for more info.
    element
      .shadow()
      .find('va-select.usa-form-group--month-select')
      .shadow()
      .find('select')
      .as('monthSelect')
      .select(parseInt(month, 10));
    cy.get('@monthSelect')
      .realPress('Tab')
      .realType(day)
      .realPress('Tab')
      .realType(year);
  } else {
    element
      .shadow()
      .find('va-select.usa-form-group--month-select')
      .shadow()
      .find('select')
      .as('monthSelect')
      .select(parseInt(month, 10));

    cy.get('@monthSelect').then(() => {
      cy.get(`va-memorable-date[name="root_${field}"]`)
        .shadow()
        .find('va-text-input.usa-form-group--day-input')
        .shadow()
        .find('input')
        .as('dayInput')
        .type(day);

      cy.get('@dayInput').then(() => {
        cy.get(`va-memorable-date[name="root_${field}"]`)
          .shadow()
          .find('va-text-input.usa-form-group--year-input')
          .shadow()
          .find('input')
          .type(year);
      });
    });
  }
});

Cypress.Commands.add('enterWebComponentData', field => {
  switch (field.tagName) {
    case 'VA-TEXT-INPUT': {
      cy.fillTextWebComponent(field.element, field.data);
      break;
    }

    case 'VA-TEXTAREA': {
      cy.fillTextAreaWebComponent(field.element, field.data);
      break;
    }

    case 'VA-CHECKBOX': {
      cy.selectCheckboxWebComponent(field.element, field.data);
      break;
    }

    case 'VA-SELECT': {
      cy.selectDropdownWebComponent(field.element, field.data);
      break;
    }

    case 'VA-RADIO-OPTION': {
      const value = field.data;
      if (typeof value !== 'undefined') {
        if (typeof value === 'boolean') {
          cy.selectYesNoWebComponent(field.key, value);
        } else {
          cy.selectRadioWebComponent(field.key, value);
        }
      }
      break;
    }

    case 'VA-MEMORABLE-DATE': {
      cy.fillMemorableDateWebComponent(field.key, field.data);
      break;
    }

    default:
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
  }
});
