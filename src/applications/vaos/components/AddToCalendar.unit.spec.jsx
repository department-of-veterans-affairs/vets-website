import React from 'react';
import { expect } from 'chai';
import { addMinutes } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddToCalendar from './AddToCalendar';

import { getICSTokens, ICS_LINE_LIMIT } from '../utils/calendar';
import { DATE_FORMAT_STRINGS } from '../utils/constants';

describe('VAOS Component: AddToCalendar', () => {
  it('should render link with calendar info', () => {
    const timezone = 'America/Denver';
    const start = zonedTimeToUtc(new Date(), timezone);
    const end = addMinutes(start, 60);
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description={{ text: 'Follow-up/Routine: some description' }}
        location="123 main street, bozeman, MT"
        duration={60}
        timezone={timezone}
        startDateTime={formatInTimeZone(
          start,
          timezone,
          DATE_FORMAT_STRINGS.ISODateTime,
        )}
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
      `Add ${formatInTimeZone(
        start,
        timezone,
        DATE_FORMAT_STRINGS.friendlyDate,
      )} appointment to your calendar`,
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
      `DTSTAMP:${formatInTimeZone(
        start,
        'UTC',
        DATE_FORMAT_STRINGS.iCalDateTimeUTC,
      )}`,
    );
    expect(ics).to.contain(
      `DTSTART:${formatInTimeZone(
        start,
        'UTC',
        DATE_FORMAT_STRINGS.iCalDateTimeUTC,
      )}`,
    );
    expect(ics).to.contain(
      `DTEND:${formatInTimeZone(
        end,
        'UTC',
        DATE_FORMAT_STRINGS.iCalDateTimeUTC,
      )}`,
    );
  });

  it('should render link with calendar info for phone appointment', () => {
    const timezone = 'America/Denver';
    const start = zonedTimeToUtc(new Date(), timezone);
    const end = addMinutes(start, 60);
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description={{ text: 'Follow-up/Routine: some description' }}
        location="Phone call"
        duration={60}
        timezone={timezone}
        startDateTime={formatInTimeZone(
          start,
          timezone,
          DATE_FORMAT_STRINGS.ISODateTime,
        )}
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
      `Add ${formatInTimeZone(
        start,
        timezone,
        DATE_FORMAT_STRINGS.friendlyDate,
      )} appointment to your calendar`,
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
      `DTSTAMP:${formatInTimeZone(
        start,
        'UTC',
        DATE_FORMAT_STRINGS.iCalDateTimeUTC,
      )}`,
    );
    expect(ics).to.contain(
      `DTSTART:${formatInTimeZone(
        start,
        'UTC',
        DATE_FORMAT_STRINGS.iCalDateTimeUTC,
      )}`,
    );
    expect(ics).to.contain(
      `DTEND:${formatInTimeZone(
        end,
        'UTC',
        DATE_FORMAT_STRINGS.iCalDateTimeUTC,
      )}`,
    );
  });

  // All ICS file properties have a 75 character line limit. So the 'description' property,
  // which is comprised of multiply values, is folded into multiply lines 75 characters long
  // with each line starting with a tab character.

  it('should properly format long description text', () => {
    const timezone = 'America/Denver';
    const start = zonedTimeToUtc(new Date(), timezone);
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
        duration={60}
        timezone={timezone}
        startDateTime={formatInTimeZone(
          start,
          timezone,
          DATE_FORMAT_STRINGS.ISODateTime,
        )}
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
        startDateTime={new Date()}
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
