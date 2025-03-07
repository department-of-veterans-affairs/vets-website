import { addDays, addMonths, format, startOfMonth } from 'date-fns';
import PageObject from './PageObject';

export class PreferredDatePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/preferred-date');
    cy.axeCheckBestPractice();

    return this;
  }

  typeDate({ date } = {}) {
    const preferredDate =
      date || addDays(startOfMonth(addMonths(new Date(), 1)), 4);
    cy.fillVaDate('root_preferredDate', format(preferredDate, 'yyyy-MM-dd'));

    return this;
  }
}

export default new PreferredDatePageObject();
