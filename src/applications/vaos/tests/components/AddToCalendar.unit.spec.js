import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import userEvent from '@testing-library/user-event';
import moment from '../../lib/moment-tz';
import AddToCalendar from '../../components/AddToCalendar';

import { getICSTokens, ICS_LINE_LIMIT } from '../../utils/calendar';
import { getTestDate } from '../mocks/setup';

describe('VAOS Component: AddToCalendar', () => {
  it('should render link with calendar info', () => {
    const startDateTime = moment('2020-01-02');
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description={{ text: 'Follow-up/Routine: some description' }}
        location="123 main street, bozeman, MT"
        duration={60}
        startDateTime={startDateTime.toDate()}
      />,
    );

    const addToCalendarLink = screen.getByTestId('add-to-calendar-link');
    expect(addToCalendarLink.getAttribute('text')).to.contain(
      'Add to calendar',
    );

    expect(addToCalendarLink.getAttribute('filename')).to.contain(
      'VA_Appointment.ics',
    );

    expect(addToCalendarLink.getAttribute('aria-label')).to.contain(
      'Add January 2, 2020 appointment to your calendar',
    );

    const ics = decodeURIComponent(
      addToCalendarLink
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    expect(ics).to.contain('PRODID:VA');
    expect(ics).to.contain('UID:');
    expect(ics).to.contain('SUMMARY:VA Appointment');
    expect(ics).to.contain('DESCRIPTION:Follow-up/Routine: some description');
    expect(ics).to.contain('LOCATION:123 main street\\, bozeman\\, MT');
    expect(ics).to.contain(
      `DTSTAMP:${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(ics).to.contain(
      `DTSTART:${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(ics).to.contain(
      `DTEND:${startDateTime
        .clone()
        .add(60, 'minutes')
        .utc()
        .format('YYYYMMDDTHHmmss')}`,
    );
  });

  it('should render link with calendar info for phone appointment', () => {
    const startDateTime = moment('2020-01-02');
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description={{ text: 'Follow-up/Routine: some description' }}
        location="Phone call"
        duration={60}
        startDateTime={startDateTime.toDate()}
      />,
    );

    const addToCalendarLink = screen.getByTestId('add-to-calendar-link');
    expect(addToCalendarLink.getAttribute('text')).to.contain(
      'Add to calendar',
    );

    expect(addToCalendarLink.getAttribute('filename')).to.contain(
      'VA_Appointment.ics',
    );

    expect(addToCalendarLink.getAttribute('aria-label')).to.contain(
      'Add January 2, 2020 appointment to your calendar',
    );

    const ics = decodeURIComponent(
      addToCalendarLink
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    expect(ics).to.contain('PRODID:VA');
    expect(ics).to.contain('UID:');
    expect(ics).to.contain('SUMMARY:VA Appointment');
    expect(ics).to.contain('DESCRIPTION:Follow-up/Routine: some description');
    expect(ics).to.contain('LOCATION:Phone call');
    expect(ics).to.contain(
      `DTSTAMP:${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(ics).to.contain(
      `DTSTART:${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(ics).to.contain(
      `DTEND:${startDateTime
        .clone()
        .add(60, 'minutes')
        .utc()
        .format('YYYYMMDDTHHmmss')}`,
    );
  });

  it('should generate a properly formatted .ics file when no parameters are passed', () => {
    const screen = render(<AddToCalendar />);

    const ics = decodeURIComponent(
      screen
        .getByTestId('add-to-calendar-link')
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );

    // There should be no 'undefines' in the calendar information
    expect(ics.includes('undefined')).to.be.false;
    const tokens = getICSTokens(ics);

    // There should be 11 distinct calendar properties
    expect(tokens.size).to.equal(11);

    // There should be a 'BEGIN' property for VCALENDAR and VEVENT
    expect(tokens.get('BEGIN').length).to.equal(2);
    expect(tokens.get('BEGIN').includes('VCALENDAR')).to.be.ok;
    expect(tokens.get('BEGIN').includes('VEVENT')).to.be.ok;

    expect(tokens.get('SUMMARY')).to.equal('');
    expect(tokens.get('DESCRIPTION')).to.equal('');
    expect(tokens.get('LOCATION')).to.equal('');

    // There should be a 'END' property for VCALENDAR and VEVENT
    expect(tokens.get('END').length).to.equal(2);
    expect(tokens.get('END').includes('VCALENDAR')).to.be.ok;
    expect(tokens.get('END').includes('VEVENT')).to.be.ok;
  });

  it('should generate a properly formatted .ics file when the description object is empty', () => {
    const screen = render(<AddToCalendar description={{}} />);

    const ics = decodeURIComponent(
      screen
        .getByTestId('add-to-calendar-link')
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );

    // There should be no 'undefines' in the calendar information
    expect(ics.includes('undefined')).to.be.false;

    const tokens = getICSTokens(ics);

    // There should be 11 distinct calendar properties
    expect(tokens.size).to.equal(11);

    // There should be a 'BEGIN' property for VCALENDAR and VEVENT
    expect(tokens.get('BEGIN').length).to.equal(2);
    expect(tokens.get('BEGIN').includes('VCALENDAR')).to.be.ok;
    expect(tokens.get('BEGIN').includes('VEVENT')).to.be.ok;

    expect(tokens.get('SUMMARY')).to.equal('');
    expect(tokens.get('DESCRIPTION')).to.equal('');
    expect(tokens.get('LOCATION')).to.equal('');

    // There should be a 'END' property for VCALENDAR and VEVENT
    expect(tokens.get('END').length).to.equal(2);
    expect(tokens.get('END').includes('VCALENDAR')).to.be.ok;
    expect(tokens.get('END').includes('VEVENT')).to.be.ok;
  });

  it('should generate an all day appointment', () => {
    const screen = render(<AddToCalendar />);

    const ics = decodeURIComponent(
      screen
        .getByTestId('add-to-calendar-link')
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );

    // There should be no 'undefines' in the calendar information
    expect(ics.includes('undefined')).to.be.false;

    const tokens = getICSTokens(ics);

    // There should be 11 distinct calendar properties
    expect(tokens.size).to.equal(11);

    // Expect all dates to be the current date and all appointment times to be the same
    // since no duration was defined.
    //
    // NOTE: Might remove these tests if test run longer than 1 minute which will cause
    // a failure.
    const timestamp = moment().format('YYYYMMDDThhmm');
    expect(moment(tokens.get('DTSTAMP')).format('YYYYMMDDThhmm')).to.equal(
      timestamp,
    );
    expect(moment(tokens.get('DTSTART')).format('YYYYMMDDThhmm')).to.equal(
      timestamp,
    );
    expect(moment(tokens.get('DTEND')).format('YYYYMMDDThhmm')).to.equal(
      timestamp,
    );
  });

  it('should generate a 30 minute appointment', () => {
    // Setting timezone to 11:30pm ET to test date change scenario.
    // Adding 30 minutes to this time should cause the date to change
    // to the next day.
    MockDate.set(getTestDate());

    const screen = render(<AddToCalendar duration={30} />);

    const ics = decodeURIComponent(
      screen
        .getByTestId('add-to-calendar-link')
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );

    // There should be no 'undefines' in the calendar information
    expect(ics.includes('undefined')).to.be.false;

    const tokens = getICSTokens(ics);

    // There should be 11 distinct calendar properties
    expect(tokens.size).to.equal(11);

    // Expect all dates to be the current date and the appointment end time to be start time + the duration.
    //
    // NOTE: Might remove these tests if test run longer than 1 minute which will cause
    // a failure.
    const timestamp = moment();
    const end = moment(timestamp).add(30, 'minutes');

    expect(moment(tokens.get('DTSTAMP')).format('YYYYMMDDThhmm')).to.equal(
      timestamp.format('YYYYMMDDThhmm'),
    );
    expect(moment(tokens.get('DTSTART')).format('YYYYMMDDThhmm')).to.equal(
      timestamp.format('YYYYMMDDThhmm'),
    );
    expect(moment(tokens.get('DTEND')).format('YYYYMMDDThhmm')).to.equal(
      end.format('YYYYMMDDThhmm'),
    );

    MockDate.reset();
  });

  // All ICS file properties have a 75 character line limit. So the 'description' property,
  // which is comprised of multiply values, is folded into multiply lines 75 characters long
  // with each line starting with a tab character.

  it('should propertly format long description text', () => {
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description={{
          text:
            'Testing long line descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions',
          additionalText: [
            'Testing long additional text. Testing long additional text. Testing long additional text. Testing long additional text. Testing long additional text. Testing long additional text. Testing long additional text. Testing long additional text.',
          ],
        }}
      />,
    );

    const ics = decodeURIComponent(
      screen
        .getByTestId('add-to-calendar-link')
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = getICSTokens(ics);

    // Each folded line should start with a tab character and
    // should be <= the max line length + 1 75 (to account for the tab character).
    tokens
      .get('DESCRIPTION')
      .split(/(?=\t)/g) // look ahead include the split character in the results
      .forEach((token, i) => {
        if (i !== 0) expect(token.startsWith('\t')).to.be.true;
        expect(token.length <= ICS_LINE_LIMIT + 1).to.be.true;
      });
  });

  it('should download ICS file via blob in IE', () => {
    const oldValue = window.navigator.msSaveOrOpenBlob;
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: sinon.spy(),
      writable: true,
    });
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description="Some description"
        location="A location"
        duration={60}
        startDateTime={moment('2020-01-02').toDate()}
      />,
    );

    expect(screen.getByRole('button')).to.contain.text('Add to calendar');

    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: sinon.spy(),
    });

    userEvent.click(screen.getByRole('button'));

    const filename = window.navigator.msSaveOrOpenBlob.firstCall.args[1];
    expect(window.navigator.msSaveOrOpenBlob.called).to.be.true;
    expect(filename).to.equal('VA_Appointment.ics');

    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: oldValue,
      writable: true,
    });
  });
});
