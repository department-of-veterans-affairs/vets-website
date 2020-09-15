import { FORCE_OPTION, NO_DELAY_OPTION } from '../index';

/**
 * Enters data for a field.
 * @param {Field}
 */
Cypress.Commands.add('enterData', field => {
  switch (field.type) {
    // Select fields register as having type 'select-one'.
    case 'select-one':
      cy.wrap(field.element).select(field.data, FORCE_OPTION);
      break;

    case 'checkbox': {
      if (field.data) cy.wrap(field.element).check(FORCE_OPTION);
      else cy.wrap(field.element).uncheck(FORCE_OPTION);
      break;
    }

    case 'textarea':
    case 'tel':
    case 'email':
    case 'number':
    case 'text': {
      cy.wrap(field.element)
        .clear(FORCE_OPTION)
        .type(field.data, { ...FORCE_OPTION, ...NO_DELAY_OPTION })
        .then(element => {
          // Get the autocomplete menu out of the way.
          if (element.attr('role') === 'combobox') element.blur();
        });
      break;
    }

    case 'radio': {
      let value = field.data;
      // Use 'Y' / 'N' because of the yesNo widget.
      if (typeof value === 'boolean') value = value ? 'Y' : 'N';
      const selector = `input[name="${field.key}"][value="${value}"]`;
      cy.get(selector).check(FORCE_OPTION);
      break;
    }

    case 'date': {
      const [year, month, day] = field.data
        .split('-')
        .map(
          dateComponent =>
            isFinite(dateComponent)
              ? parseInt(dateComponent, 10).toString()
              : dateComponent,
        );

      // Escape non-standard characters like dots and colons.
      const baseSelector = Cypress.$.escapeSelector(field.key);

      cy.get(`#${baseSelector}Year`)
        .clear()
        .type(year, { ...FORCE_OPTION, ...NO_DELAY_OPTION });

      cy.get(`#${baseSelector}Month`).select(month, FORCE_OPTION);

      if (day !== 'XX') cy.get(`#${baseSelector}Day`).select(day, FORCE_OPTION);

      break;
    }

    case 'file': {
      cy.get(`#${Cypress.$.escapeSelector(field.key)}`)
        .upload('example-upload.png', 'image/png')
        .get('.schemaform-file-uploading')
        .should('not.exist');
      break;
    }

    default:
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
  }

  Cypress.log({
    message: field.data,
    consoleProps: () => field,
  });
});
