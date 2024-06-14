import moment from 'moment';
import { getICSTokens } from '../../../../utils/calendar';
import PageObject from '../PageObject';
import { VIDEO_TYPES } from '../../../../utils/constants';

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
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(description[4]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
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
  } else if (type === VIDEO_TYPES.gfe) {
    expect(description[0]).to.equal(
      'You can join this meeting up to 30 minutes before the start ti',
    );
    expect(description[1]).to.equal('\tme.');
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
  } else if (type === VIDEO_TYPES.gfe) {
    expect(tokens.get('LOCATION')).to.equal('VA Video Connect at home');
  }
}
function assertSummary(type, tokens) {
  if (type === 'ATLAS') {
    // And the summary should indicate it's an ATLAS appointment
    expect(tokens.get('SUMMARY')).to.equal(
      'VA Video Connect appointment at an ATLAS facility',
    );
  } else if (type === VIDEO_TYPES.mobile) {
    // TODO: Verify this!!!
    // expect(tokens.get('SUMMARY')).to.contain('VA Video Connect appointment');
  } else if (type === VIDEO_TYPES.clinic) {
    expect(tokens.get('SUMMARY')).to.contain(
      'VA Video Connect appointment at Cheyenne VA Medical Center',
    );
  } else if (type === VIDEO_TYPES.gfe) {
    expect(tokens.get('SUMMARY')).to.equal('VA Video Connect appointment');
  }
}

export class AppointmentDetailPageObject extends PageObject {
  assertAddToCalendar() {
    this.assertShadow({
      element: '[data-testid="add-to-calendar-link"]',
      text: 'Add to calendar',
    });
    return this;
  }

  assertAddToCalendarLink({ startDate, type }) {
    cy.findByTestId('add-to-calendar-link')
      .as('link')
      .shadow();
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
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTSTART')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTEND')).to.equal(
        `${moment(startDate)
          .add(60, 'minutes') // Default duration
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('END')).includes('VEVENT');
      expect(tokens.get('END')).includes('VCALENDAR');
    });

    return this;
  }

  assertAppointmentCode() {
    this.assertText({ text: /Appointment Code: 7VBBCA/i });
    return this;
  }

  assertDirections({ exist = true } = {}) {
    this.assertLink({ name: /Directions/i, exist });
    return this;
  }

  assertJoinAppointment({ exist = true, isEnabled = true } = {}) {
    if (exist) {
      if (isEnabled) {
        cy.findByText(/Join appointment/i).should(
          'not.have.class',
          'usa-button-disabled',
        );
      } else {
        cy.findByText(/Join appointment/i).should(
          'have.class',
          'usa-button-disabled',
        );
      }
    } else {
      cy.findByText(/Join appointment/i).should('not.exist');
    }

    return this;
  }

  assertPrint() {
    this.assertText({ text: /Print/i });
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

  clickPrint() {
    cy.window().then(win => {
      cy.stub(win, 'print').as('print');
    });

    this.clickButton({ label: /Print/i });
    cy.get('@print').should('have.been.calledOnce');

    return this;
  }
}

export default new AppointmentDetailPageObject();
