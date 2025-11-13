import { addDays, addMonths, format, startOfMonth } from 'date-fns';
import PageObject from './PageObject';

function enterVaDateFields(year, month, day) {
  cy.get('@currentElement')
    .shadow()
    .then(el => {
      cy.wrap(el)
        .find('va-select.select-month')
        .shadow()
        .find('select')
        .select(month);
      cy.wrap(el)
        .find('va-select.select-day')
        .shadow()
        .find('select')
        .select(day);
      cy.wrap(el)
        .find('va-text-input.input-year')
        .shadow()
        .find('input')
        .as('yearInput');
      // Clear the default year input before typing the new year
      cy.get('@yearInput').type('{backspace}{backspace}{backspace}{backspace}');
      cy.get('@yearInput').type(year);
    });
}

class PreferredDatePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/preferred-date');
    cy.axeCheckBestPractice();

    return this;
  }

  typeDate({ date } = {}) {
    const preferredDate =
      date || addDays(startOfMonth(addMonths(new Date(), 1)), 4);
    return this.enterDate(
      'root_preferredDate',
      format(preferredDate, 'yyyy-MM-dd'),
    );
  }

  enterDate(field, dateString) {
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
    enterVaDateFields(year, month, day);

    return this;
  }

  assertPreferredDateValidationErrors() {
    const pastDate = new Date(2020, 2, 2);
    const farFutureDate = addMonths(new Date(), 24);

    this.typeDate({ date: pastDate });
    this.clickNextButton();
    this.assertValidationErrorShadow('Please enter a future date');
    this.typeDate({ date: farFutureDate });
    this.clickNextButton();
    this.assertValidationErrorShadow(
      'Please enter a date less than 395 days in the future',
    );

    return this;
  }
}

export default new PreferredDatePageObject();
