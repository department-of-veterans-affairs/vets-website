import { formatInTimeZone } from 'date-fns-tz';
import { getTimezoneByFacilityId } from '../../../utils/timezone';
import PageObject from './PageObject';

class DateTimeSelectPageObject extends PageObject {
  assertDateSelected(date, facilityId = 983) {
    const timezone = getTimezoneByFacilityId(facilityId);

    cy.findByRole('radio', {
      name: `${formatInTimeZone(date, timezone, 'h:mm a')} option selected`,
    });

    return this;
  }

  assertRequestLink({ status = 'warning', exist = true } = {}) {
    cy.get(`va-alert[status=${status}]`)
      .as('alert')
      .shadow();
    cy.get('@alert')
      .contains('Request an appointment')
      .should(exist ? 'exist' : 'not.exist');
    return this;
  }

  assertUrl() {
    cy.url().should('include', '/date-time');
    cy.wait('@v2:get:slots');

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

  compareDatesClickNextMonth(firstDate, secondDate) {
    if (firstDate.month() < secondDate.month()) {
      cy.contains('button', 'Next')
        .as('button')
        .should('not.be.disabled')
        .focus();
      cy.get('@button').click();
    }
    return this;
  }

  clickPreviousMonth() {
    return this;
  }

  selectDate(date, timezone = 'America/Denver') {
    cy.get(
      `.vaos-calendar__calendars button[id^="date-cell-${formatInTimeZone(
        date,
        timezone,
        'yyyy-MM-dd',
      )}"]:not([disabled])`,
    )
      .then($button => {
        return $button[0];
      })
      .click({ waitForAnimations: true });
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();

    return this;
  }

  selectFirstAvailableDate() {
    cy.get('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
      .then($button => {
        return $button[0];
      })
      .click({ waitForAnimations: true });
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();

    return this;
  }
}

export default new DateTimeSelectPageObject();
