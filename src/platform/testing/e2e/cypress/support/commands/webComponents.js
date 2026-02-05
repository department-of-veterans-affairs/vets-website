import get from 'platform/utilities/data/get';
import { makeMinimalPNG } from '../form-tester/utilities';

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

Cypress.Commands.add('selectVaComboBox', (field, value) => {
  if (typeof value !== 'undefined') {
    const strValue = value.toString();
    const element =
      typeof field === 'string'
        ? cy.get(`va-combo-box[name="${field}"]`)
        : cy.wrap(field);

    element
      .shadow()
      .find('input')
      .as('inputElement');

    cy.get('@inputElement').click();

    cy.get('@inputElement').clear(DELAY_OPTION);

    const elementAgain =
      typeof field === 'string'
        ? cy.get(`va-combo-box[name="${field}"]`)
        : cy.wrap(field);

    elementAgain
      .shadow()
      .find('select')
      .as('selectElement');

    cy.get('@selectElement')
      .find(`option[value="${strValue}"]`)
      .invoke('text')
      .as('optionLabel');

    cy.get('@optionLabel').then(label => {
      cy.get('@inputElement').type(label, FORCE_OPTION);
      cy.get('@inputElement').type('{enter}');
    });
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

Cypress.Commands.add('fillVaFileInput', (field, value, file) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-file-input[name="${field}"]`)
        : cy.wrap(field);

    element.then(async $el => {
      const el = $el[0];

      const stopNativeVaChange = e => {
        e.stopImmediatePropagation();
        e.stopPropagation();
      };
      el.addEventListener('vaChange', stopNativeVaChange, true);

      cy.then(() => file || makeMinimalPNG()).then(async mockFile => {
        // If caller already provided Cypress selectFile arg, use it as-is
        const selectFileArg =
          mockFile &&
          typeof mockFile === 'object' &&
          Object.prototype.hasOwnProperty.call(mockFile, 'contents')
            ? mockFile
            : {
                contents: Cypress.Buffer.from(await mockFile.arrayBuffer()),
                fileName: mockFile.name || 'placeholder.png',
                mimeType: mockFile.type || 'image/png',
                lastModified: mockFile.lastModified || Date.now(),
              };

        cy.wrap(el)
          .shadow()
          .find('input[type="file"]')
          .selectFile(selectFileArg, { force: true });

        cy.wrap(el)
          .shadow()
          .find('input[type="file"]')
          .then($input => {
            el.removeEventListener('vaChange', stopNativeVaChange, true);

            const selected = $input[0]?.files?.[0];

            // If the component set an error, don't force our own vaChange
            const error = el.getAttribute('error');
            if (error) return;

            const mockFormData = {
              name: value?.name || selected?.name || selectFileArg.fileName,
              size: value?.size || selected?.size,
              password: value?.password,
              additionalData: value?.additionalData || {},
              confirmationCode: value?.confirmationCode || 'abc123',
              isEncrypted: value?.isEncrypted,
              hasAdditionalInputError: false,
              hasPasswordError: false,
            };

            // Dispatch a vaChange that matches what the forms-system expects in tests
            el.dispatchEvent(
              new CustomEvent('vaChange', {
                detail: { files: selected ? [selected] : [], mockFormData },
                bubbles: true,
                composed: true,
              }),
            );
          });
      });
    });
  }
});

Cypress.Commands.add('fillVaFileInputMultiple', (field, value) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-file-input-multiple[name="${field}"]`)
        : cy.wrap(field);

    element.then(async $el => {
      const el = $el[0];

      const pngFile = await makeMinimalPNG();
      const detail = {
        action: 'FILE_ADDED',
        file: pngFile,
        state: [{ file: pngFile, password: undefined, changed: true }],
        mockFormData: {
          confirmationCode: 'abc123',
          name: 'placeholder.png',
          size: 123,
          additionalData: {
            documentStatus: 'public',
          },
        },
      };

      const options = {
        detail,
        bubbles: true,
        composed: true,
      };

      const event = new CustomEvent('vaMultipleChange', options);
      el.dispatchEvent(event);
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

    case 'VA-COMBO-BOX': {
      cy.selectVaComboBox(field.element, field.data);
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

    case 'VA-FILE-INPUT': {
      cy.fillVaFileInput(field.key, field.data);
      break;
    }

    case 'VA-FILE-INPUT-MULTIPLE': {
      cy.fillVaFileInputMultiple(field.key, field.data);
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
  ({ field = '', fullName = '', checked } = {}) => {
    let element;

    if (!field) {
      element = cy.get('va-statement-of-truth');
    } else if (typeof field === 'string') {
      element = cy.get(`va-statement-of-truth[name="${field}"]`);
    } else {
      element = cy.wrap(field);
    }

    element.shadow().within(() => {
      if (fullName) {
        cy.get('va-text-input').then($el => cy.fillVaTextInput($el, fullName));
      }
      if (typeof checked === 'boolean') {
        cy.get('va-checkbox').then($el => cy.selectVaCheckbox($el, checked));
      }
    });
  },
);

/**
 * Determines whether to "add another" item based on test data vs existing cards.
 * @param {string} selector - CSS selector for the element with data-array-path
 * @param {boolean} overrideValue - Optional override value
 * @param {function} actionCallback - Function to call with the decision (true/false)
 */
function arrayBuilderConditionalAction(
  selector,
  overrideValue,
  actionCallback,
) {
  // If override is provided, use it directly
  if (typeof overrideValue === 'boolean') {
    return actionCallback(overrideValue);
  }

  // Otherwise, auto-determine based on test data and existing cards
  return cy.get(selector).then($element => {
    const arrayPath = $element.attr('data-array-path');

    return cy.get('@testData').then(testData => {
      const arrayData = get(arrayPath, testData, []);
      const arrayLength = Array.isArray(arrayData) ? arrayData.length : 0;

      return cy.get('body').then($body => {
        const cardCount = $body.find('va-card').length;
        const shouldAddAnother = arrayLength > cardCount;

        return actionCallback(shouldAddAnother);
      });
    });
  });
}

/**
 * Selects Yes/No for array builder summary page conditionally based on test data and existing cards on the page.
 * @param {boolean} [overrideValue]
 */
Cypress.Commands.add('selectArrayBuilderSummaryYesNo', overrideValue => {
  return arrayBuilderConditionalAction(
    '.wc-pattern-array-builder-yes-no',
    overrideValue,
    shouldSelect => {
      return cy.get('.wc-pattern-array-builder-yes-no').then($element => {
        const fieldName = $element.attr('name');
        cy.selectYesNoVaRadioOption(fieldName, shouldSelect);
        return cy.wrap(null, { log: false });
      });
    },
  );
});

/**
 * Clicks array builder summary page add button conditionally based on test data and existing cards on the page.
 * @param {boolean} [overrideValue]
 */
Cypress.Commands.add('clickArrayBuilderSummaryAddButton', overrideValue => {
  return arrayBuilderConditionalAction(
    '.wc-pattern-array-builder-summary-add-button',
    overrideValue,
    shouldClick => {
      if (shouldClick) {
        cy.get('.wc-pattern-array-builder-summary-add-button').click();
        // we abort because we will have navigated to a new page
        return cy.wrap({ abortProcessing: true }, { log: false });
      }
      return cy.wrap(null, { log: false });
    },
  );
});

/**
 * Clicks array builder summary page add link conditionally based on test data and existing cards on the page.
 * @param {boolean} [overrideValue]
 */
Cypress.Commands.add('clickArrayBuilderSummaryAddLink', overrideValue => {
  return arrayBuilderConditionalAction(
    '.wc-pattern-array-builder-summary-add-link',
    overrideValue,
    shouldClick => {
      if (shouldClick) {
        cy.get('.wc-pattern-array-builder-summary-add-link').click();
        // we abort because we will have navigated to a new page
        return cy.wrap({ abortProcessing: true }, { log: false });
      }
      return cy.wrap(null, { log: false });
    },
  );
});

/**
 * General-purpose array builder summary continue command that auto-detects the pattern type
 * (yes/no radio, button, or link) and applies the appropriate interaction based on the cards present.
 * @param {boolean} [overrideValue] - true=add another, false=continue without adding
 */
Cypress.Commands.add('arrayBuilderSummaryContinue', overrideValue => {
  return cy.get('body').then($body => {
    const hasYesNoRadio =
      $body.find('.wc-pattern-array-builder-yes-no').length > 0;
    if (hasYesNoRadio) {
      return cy.selectArrayBuilderSummaryYesNo(overrideValue);
    }

    const hasButton =
      $body.find('.wc-pattern-array-builder-summary-add-button').length > 0;
    if (hasButton) {
      return cy.clickArrayBuilderSummaryAddButton(overrideValue);
    }

    const hasLink =
      $body.find('.wc-pattern-array-builder-summary-add-link').length > 0;
    if (hasLink) {
      return cy.clickArrayBuilderSummaryAddLink(overrideValue);
    }

    cy.log('Warning: No array builder pattern found (yes/no, button, or link)');
    return cy.wrap(null, { log: false });
  });
});
