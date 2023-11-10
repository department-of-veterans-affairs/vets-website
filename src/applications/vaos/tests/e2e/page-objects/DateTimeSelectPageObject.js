import PageObject from './PageObject';

export class DateTimeSelectPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/date-time');

    cy.wait('@v2:get:slots');
    cy.axeCheckBestPractice();

    return this;
  }

  clickNextMonth() {
    cy.contains('button', 'Next')
      .as('button')
      .should('not.be.disabled')
      .focus();
    cy.get('@button').click();

    return this;
  }

  clickPreviousMonth() {
    return this;
  }

  selectFirstAvailableDate() {
    cy.get(
      '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])',
    ).click({ waitForAnimations: true });
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();

    return this;
  }
}

export default new DateTimeSelectPageObject();
