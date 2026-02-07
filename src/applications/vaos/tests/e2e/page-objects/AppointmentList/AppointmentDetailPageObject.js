import { addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getICSTokens } from '../../../../utils/calendar';
import { DATE_FORMATS, VIDEO_TYPES } from '../../../../utils/constants';
import PageObject from '../PageObject';

function assertDescription(type, tokens) {
  // Description text longer than 74 characters should start on newline beginning
  // with a tab character
  let description = tokens.get('DESCRIPTION');
  description = description.split(/(?=\t)/g); // look ahead include the split character in the results

  if (type === VIDEO_TYPES.adhoc) {
    // And the description should contain the ATLAS facility and provider info
    expect(description[0]).to.equal(
      'Join this video meeting from this ATLAS (non-VA) location:',
    );
    expect(description[1]).to.equal('\t\\n\\n114 Dewey Ave\\n');
    expect(description[2]).to.equal('\tEureka\\, MT 59917\\n');
    expect(description[3]).to.equal(
      '\t\\nYour appointment code is 7VBBCA. Use this code to find your appointment ',
    );
    expect(description[4]).to.equal(
      '\ton the computer at the ATLAS facility.\\n',
    );
    // expect(description[5]).to.equal(
    //   "\t\\nYou'll be meeting with Meg Smith\\n",
    // );
  } else if (type === VIDEO_TYPES.mobile) {
    expect(description[0]).to.equal(
      'You can join this meeting up to 30 minutes before the start ti',
    );
    expect(description[1]).to.equal('\tme.');
    expect(description[2]).to.equal('\t\\n\\nVA Video Connect at home\\n');
    expect(description[3]).to.equal(
      '\t\\nSign in to https://va.gov/my-health/appointments/ to get details about t',
    );
    expect(description[4]).to.equal('\this appointment\\n');
  } else if (type === VIDEO_TYPES.clinic) {
    expect(description[0]).to.equal(
      'You need to join this video meeting from:',
    );
    expect(description[1]).to.equal('\t\\n\\nCheyenne VA Medical Center');
    expect(description[2]).to.equal('\t\\n2360 East Pershing Boulevard\\n');
    expect(description[3]).to.equal(
      '\tSuite 10\\, City 983\\, WY 82001-5356\\n',
    );
    expect(description[4]).to.equal('\t307-778-7550\\n');
  }
}
function assertLocation(type, tokens) {
  if (type === 'ATLAS') {
    expect(tokens.get('LOCATION')).to.equal(
      '114 Dewey Ave\\, Eureka\\, MT 59917',
    );
  } else if (type === VIDEO_TYPES.mobile) {
    expect(tokens.get('LOCATION')).to.equal('VA Video Connect at home');
  } else if (type === VIDEO_TYPES.clinic) {
    expect(tokens.get('LOCATION')).to.equal(
      '2360 East Pershing Boulevard\\, Suite 10\\, City 983\\, WY 82001-5356',
    );
  }
}
function assertSummary(type, tokens) {
  if (type === 'ATLAS') {
    // And the summary should indicate it's an ATLAS appointment
    expect(tokens.get('SUMMARY')).to.equal(
      'VA Video Connect appointment at an ATLAS facility',
    );
  } else if (type === VIDEO_TYPES.mobile) {
    expect(tokens.get('SUMMARY')).to.contain('VA Video Connect appointment');
  } else if (type === VIDEO_TYPES.clinic) {
    expect(tokens.get('SUMMARY')).to.contain(
      'VA Video Connect appointment at Cheyenne VA Medical Center',
    );
  }
}

class AppointmentDetailPageObject extends PageObject {
  assertAddToCalendar() {
    this.assertShadow({
      element: '[data-testid="add-to-calendar-button"]',
      text: 'Add to calendar',
    });
    return this;
  }

  assertAddToCalendarLink({ startDate, type }) {
    cy.findByTestId('add-to-calendar-link', { hidden: true }).as('link');
    cy.get('@link').should($foo => {
      const ics = decodeURIComponent(
        $foo.attr('href').replace('data:text/calendar;charset=utf-8,', ''),
      );
      const tokens = getICSTokens(ics);

      // Then it should be in the correct ICS format
      expect(tokens.get('BEGIN')).includes('VCALENDAR');
      expect(tokens.get('VERSION')).to.equal('2.0');
      expect(tokens.get('PRODID')).to.equal('VA');
      expect(tokens.get('BEGIN')).includes('VEVENT');
      // eslint-disable-next-line no-unused-expressions
      expect(tokens.has('UID')).to.be.true;

      assertSummary(type, tokens);
      assertDescription(type, tokens);
      assertLocation(type, tokens);

      // And the start time should match the appointment
      expect(tokens.get('DTSTAMP')).to.equal(
        formatInTimeZone(startDate, 'UTC', DATE_FORMATS.iCalDateTimeUTC),
      );
      expect(tokens.get('DTSTART')).to.equal(
        formatInTimeZone(startDate, 'UTC', DATE_FORMATS.iCalDateTimeUTC),
      );
      expect(tokens.get('DTEND')).to.equal(
        formatInTimeZone(
          addMinutes(startDate, 60),
          'UTC',
          DATE_FORMATS.iCalDateTimeUTC,
        ),
      );
      expect(tokens.get('END')).includes('VEVENT');
      expect(tokens.get('END')).includes('VCALENDAR');
    });

    return this;
  }

  assertAppointmentCode() {
    this.assertText({ text: /7VBBCA/i });
    return this;
  }

  assertCancelButton() {
    this.assertShadow({
      element: '[data-testid="print-button"]',
      text: 'Print',
    });

    return this;
  }

  assertDirections({ exist = true } = {}) {
    this.assertLink({ name: /Directions/i, exist });
    return this;
  }

  assertPrint() {
    this.assertShadow({
      element: '[data-testid="print-button"]',
      text: 'Print',
    });

    return this;
  }

  assertTypeOfCare({ text }) {
    this.assertText({ text });
    return this;
  }

  assertUrl() {
    cy.url().should('include', '/1', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  assertDaysLeftToFile() {
    // Verify that the days left is a valid number
    cy.findAllByTestId('days-left-to-file').each(el => {
      const text = el.text();
      const parts = text.split(':');
      // Is it a valid number
      expect(Number.isInteger(parseInt(parts[1].trim(), 10))).to.equal(true);
      // Is it a positive number
      expect(parseInt(parts[1], 10)).to.be.at.least(0);
    });

    return this;
  }

  clickCancelButton() {
    cy.get('[data-testid="cancel-button"]')
      .shadow()
      .findByText(/Cancel appointment/i)
      .click();

    return this;
  }

  clickPrint() {
    cy.window().then(win => {
      cy.stub(win, 'print').as('print');
    });

    this.clickButton({ label: /Print/i });
    cy.get('@print').should('have.been.calledOnce');

    return this;
  }

  assertAfterVisitSummaryError({ exist = true } = {}) {
    if (exist) {
      // Wait for appointment details page to load

      cy.findByRole('heading', {
        name: /Some appointment features|can.t access/,
        timeout: 1000,
      }).should('exist');

      // Check for ErrorAlert error (new approach with travelPayViewClaimDetails flag)
      // or AfterVisitSummary error (legacy approach without flag)
      cy.get('body').then($body => {
        const hasLegacyError = $body
          .find('h2')
          .text()
          .includes("We can't access after-visit summaries at this time.");
        const hasNewError =
          $body.find('[data-testid="avs-error-content"]').length > 0;
        const hasClaimError =
          $body.find('[data-testid="avs-claim-error-content"]').length > 0;

        if (!hasLegacyError && !hasNewError && !hasClaimError) {
          throw new Error(
            'Expected AVS error to be displayed via ErrorAlert or AfterVisitSummary, but found neither',
          );
        }
      });
    } else {
      // Neither error should exist
      cy.findByRole('heading', {
        name: /We can't access after-visit summaries at this time./i,
      }).should('not.exist');
      cy.findByTestId('avs-error-content').should('not.exist');
      cy.findByTestId('avs-claim-error-content').should('not.exist');
    }
    return this;
  }

  assertAfterVisitSummaryPdf({ exist = true, count = null } = {}) {
    if (exist) {
      cy.findByTestId('after-visit-summary-pdf-list').should('exist');
      if (count !== null) {
        cy.findByTestId('after-visit-summary-pdf-list')
          .find('li')
          .should('have.length', count);
      }
    } else {
      cy.findByTestId('after-visit-summary-pdf-list').should('not.exist');
    }
    return this;
  }

  assertAfterVisitSummaryNotAvailable() {
    cy.findByText(
      'An after-visit summary is not available at this time.',
    ).should('exist');
    return this;
  }
}

export default new AppointmentDetailPageObject();
