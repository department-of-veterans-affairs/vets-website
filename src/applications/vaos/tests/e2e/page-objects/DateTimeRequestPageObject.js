import PageObject from './PageObject';

export class DateTimeRequestPageObject extends PageObject {
  assertUrl({ isVARequest = true } = {}) {
    if (isVARequest) cy.url().should('include', '/va-request');
    else cy.url().should('include', '/community-request');

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
      '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled]):first',
    ).click();
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();

    return this;
  }
}

export default new DateTimeRequestPageObject();
