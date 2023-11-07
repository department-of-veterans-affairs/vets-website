import PageObject from './PageObject';

/**
 *
 * @export
 * @class DateTimeSelectPageObject
 * @extends {PageObject}
 */
export class DateTimeSelectPageObject extends PageObject {
  /**
   * Method to assert the URL.
   *
   * @returns Instance
   * @memberof DateTimeSelectPageObject
   */
  assertUrl() {
    cy.url().should('include', '/date-time');
    cy.axeCheckBestPractice();

    return this;
  }

  /**
   * Method to click the 'next' month calendar button.
   *
   * @returns Instance
   * @memberof DateTimeSelectPageObject
   */
  clickNextMonth() {
    cy.contains('button', 'Next')
      .as('button')
      .should('not.be.disabled')
      .focus();
    cy.get('@button').click();

    return this;
  }

  /**
   * Method to click the 'previous' month button.
   *
   * @returns Instance
   * @memberof DateTimeSelectPageObject
   */
  clickPreviousMonth() {
    return this;
  }

  /**
   * Method to select the first available date.
   *
   * @returns Instance
   * @memberof DateTimeSelectPageObject
   */
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
