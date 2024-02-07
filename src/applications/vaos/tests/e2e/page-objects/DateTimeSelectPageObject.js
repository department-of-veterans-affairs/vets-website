import moment from 'moment';
import { getTimezoneByFacilityId } from '../../../utils/timezone';
import PageObject from './PageObject';

export class DateTimeSelectPageObject extends PageObject {
  assertDateSelected(date, facilityId = 983) {
    const timezone = getTimezoneByFacilityId(facilityId);
    const d = moment(date).tz(timezone);

    cy.findByRole('radio', {
      name: `${d.format('h:mm')} ${d.format('A')} option selected`,
    });

    return this;
  }

  assertRequestLink({ exist = true } = {}) {
    cy.get('va-alert[status=warning]')
      .as('alert')
      .shadow();
    cy.get('@alert')
      .contains('Request an earlier appointment')
      .should(exist ? 'exist' : 'not.exist');
    return this;
  }

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

  selectDate(date) {
    // console.log(typeof date, date instanceof moment)
    cy.get(
      `.vaos-calendar__calendars button[id^="date-cell-${date.format(
        'YYYY-MM-DD',
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
