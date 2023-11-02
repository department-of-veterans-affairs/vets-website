import PageObject from './PageObject';

export class DateTimeSelectPageObject extends PageObject {
  assertUrl({ isCovid = false } = {}) {
    if (isCovid) {
      cy.url().should('include', '/date-time');
    } else {
      cy.url().should('include', '/select-date');
    }

    cy.wait('@v2:get:slots');
    cy.axeCheckBestPractice();

    return this;
  }

  selectNextMonth() {
    cy.contains('button', 'Next')
      .as('button')
      .should('not.be.disabled')
      .focus();
    cy.get('@button').click();

    return this;
  }

  selectPreviousMonth() {
    return this;
  }

  selectFirstAvailableDate() {
    cy.get(
      '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])',
    ).click();
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();

    return this;
  }
}

export default new DateTimeSelectPageObject();
