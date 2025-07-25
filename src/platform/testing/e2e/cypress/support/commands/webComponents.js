const FORCE_OPTION = { force: true };
const DELAY_OPTION = { force: true, delay: 100 };

Cypress.Commands.add('selectVaButtonPairPrimary', field => {
  const selector = `va-button-pair${field ? `[name="${field}"]` : ''}`;
  cy.get(selector)
    .shadow()
    .find('va-button:not([secondary]):not([back])')
    .first()
    .click();
});

Cypress.Commands.add('selectVaButtonPairSecondary', field => {
  const selector = `va-button-pair${field ? `[name="${field}"]` : ''}`;
  cy.get(selector)
    .shadow()
    .find('va-button[secondary], va-button[back]')
    .first()
    .click();
});

Cypress.Commands.add('fillVaTextInput', (field, value) => {
  if (typeof value !== 'undefined') {
    const strValue = value.toString();
    const element =
      typeof field === 'string'
        ? cy.get(`va-text-input[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('input')
      .as('currentElement');

    cy.get('@currentElement').click();

    cy.get('@currentElement').clear(DELAY_OPTION);

    if (strValue !== '') {
      // using type requires a non-empty value
      cy.get('@currentElement').type(strValue, FORCE_OPTION);
    }

    cy.get('@currentElement').then($el => {
      // masked SSN appears on blur, so it won't match the strValue
      if (!$el.hasClass('masked-ssn')) {
        cy.wrap($el).should('have.value', strValue);
      }
    });
  }
});

Cypress.Commands.add('fillVaTextarea', (field, value) => {
  if (typeof value !== 'undefined') {
    const strValue = value.toString();
    const element =
      typeof field === 'string'
        ? cy.get(`va-textarea[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('textarea')
      .as('currentElement');

    cy.get('@currentElement').clear(DELAY_OPTION);

    if (strValue !== '') {
      // using type requires a non-empty value
      cy.get('@currentElement').type(strValue, FORCE_OPTION);
    }

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

Cypress.Commands.add('fillVaTelephoneInput', (field, value) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-telephone-input[name="${field}"]`)
        : cy.wrap(field);
    element.shadow().within(() => {
      cy.get('va-text-input').then($contact => {
        cy.fillVaTextInput($contact, value.contact);
      });
    });
  }
});

function fillVaDateFields(year, month, day, monthYearOnly) {
  cy.get('@currentElement')
    .shadow()
    .then(el => {
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

Cypress.Commands.add('fillVaDate', (field, dateString, isMonthYearOnly) => {
  if (dateString) {
    const element =
      typeof field === 'string'
        ? cy.get(`va-date[name="${field}"]`)
        : cy.wrap(field);
    element.as('currentElement');

    const [year, month, day] = dateString.split('-').map(
      dateComponent =>
        // eslint-disable-next-line no-restricted-globals
        isFinite(dateComponent)
          ? parseInt(dateComponent, 10).toString()
          : dateComponent,
    );

    if (isMonthYearOnly == null) {
      element.invoke('attr', 'month-year-only').then(monthYearOnlyAttr => {
        fillVaDateFields(year, month, day, monthYearOnlyAttr === 'true');
      });
    } else {
      fillVaDateFields(year, month, day, isMonthYearOnly);
    }
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
            .clear({ force: true, delay: 0 })
            .focus();
          cy.realType(month);
        } else {
          cy.wrap(el)
            .find(getSelectors('month'))
            .shadow()
            .find('input')
            .clear({ force: true, delay: 0 })
            .type(month);
        }

        // day and year
        if (isChrome) {
          cy.wrap(el)
            .find(getSelectors('day'))
            .shadow()
            .find('input')
            .clear({ force: true, delay: 0 })
            .focus();
          cy.realType(day);
          cy.wrap(el)
            .find(getSelectors('year'))
            .shadow()
            .find('input')
            .clear({ force: true, delay: 0 })
            .focus();
          cy.realType(year);
        } else {
          cy.wrap(el)
            .find(getSelectors('day'))
            .shadow()
            .find('input')
            .clear({ force: true, delay: 0 })
            .type(day);
          cy.wrap(el)
            .find(getSelectors('year'))
            .shadow()
            .find('input')
            .clear({ force: true, delay: 0 })
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

    case 'VA-TELEPHONE-INPUT': {
      cy.fillVaTelephoneInput(field.key, field.data);
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

// Helper function to fill out fields in a single page array with 'useVaCards'
Cypress.Commands.add(
  'fillFieldsInVaCardIfNeeded',
  (fields, index, fillFieldsInVaCard, numItems) => {
    const isFirstItem = index === 0;
    const isLastItem = index === numItems - 1;
    if (isFirstItem) {
      fillFieldsInVaCard(fields, index);
    } else {
      cy.get('va-card').then($vaCard => {
        if ($vaCard.length > 0 && $vaCard.get(0).shadowRoot !== null) {
          fillFieldsInVaCard(fields, index);
        } else {
          // If <va-card /> is not found, log an error (this should not happen)
          cy.log('<va-card> element not found');
        }
      });
    }
    if (!isLastItem) {
      cy.get('button.va-growable-add-btn').click();
    }
  },
);

/**
 * Custom command to check if the current page uses web components.
 *
 * @example
 * cy.checkWebComponent(hasWebComponents => {
 *   if (hasWebComponents) {
 *     // Handle web components case
 *   } else {
 *     // Handle traditional form elements
 *   }
 * });
 */
Cypress.Commands.add('checkWebComponent', callback => {
  // Check for common VA web component prefixes
  const webComponentSelectors = [
    'va-text-input',
    'va-textarea',
    'va-select',
    'va-checkbox',
    'va-radio-option',
    'va-date',
    'va-memorable-date',
    'va-button',
    'va-card',
  ];

  cy.document().then(document => {
    const hasWebComponents = webComponentSelectors.some(
      selector => document.querySelector(selector) !== null,
    );

    // Execute the callback with the result
    callback(hasWebComponents);
  });
});

Cypress.Commands.add(
  'fillAddressWebComponentPattern',
  (fieldName, addressObject) => {
    if (!addressObject) {
      return;
    }
    cy.selectVaCheckbox(
      `root_${fieldName}_isMilitary`,
      addressObject.isMilitary,
    );

    if (addressObject.city) {
      if (addressObject.isMilitary) {
        cy.get('body').then(body => {
          if (body.find(`va-radio[name="root_${fieldName}_city"]`).length > 0) {
            cy.selectVaRadioOption(
              `root_${fieldName}_city`,
              addressObject.city,
            );
          } else {
            cy.selectVaSelect(`root_${fieldName}_city`, addressObject.city);
          }
        });
      } else {
        cy.fillVaTextInput(`root_${fieldName}_city`, addressObject.city);
      }
    }

    cy.selectVaSelect(`root_${fieldName}_country`, addressObject.country);
    cy.fillVaTextInput(`root_${fieldName}_street`, addressObject.street);
    cy.fillVaTextInput(`root_${fieldName}_street2`, addressObject.street2);
    cy.fillVaTextInput(`root_${fieldName}_street3`, addressObject.street3);

    cy.get('body').then(body => {
      const stateField = `root_${fieldName}_state`;

      if (
        addressObject.isMilitary &&
        body.find(`va-radio[name="${stateField}"]`).length
      ) {
        cy.selectVaRadioOption(stateField, addressObject.state);
      } else if (body.find(`va-select[name="${stateField}"]`).length) {
        cy.selectVaSelect(stateField, addressObject.state);
      } else if (body.find(`va-text-input[name="${stateField}"]`).length) {
        cy.fillVaTextInput(stateField, addressObject.state);
      }
    });

    cy.fillVaTextInput(
      `root_${fieldName}_postalCode`,
      addressObject.postalCode,
    );
  },
);

Cypress.Commands.add(
  'fillVaStatementOfTruth',
  (field, { fullName, checked } = {}) => {
    if (!fullName && typeof checked !== 'boolean') return;

    const element =
      typeof field === 'string'
        ? cy.get(`va-statement-of-truth[name="${field}"]`)
        : cy.wrap(field);

    element.shadow().within(() => {
      if (fullName) {
        cy.get('va-text-input').then($el => cy.fillVaTextInput($el, fullName));
      }
      if (checked) {
        cy.get('va-checkbox').then($el => cy.selectVaCheckbox($el, checked));
      }
    });
  },
);
