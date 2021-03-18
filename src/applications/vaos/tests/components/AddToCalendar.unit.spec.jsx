import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import moment from '../../lib/moment-tz.js';

import AddToCalendar from '../../components/AddToCalendar';
import userEvent from '@testing-library/user-event';

describe('VAOS <AddToCalendar>', () => {
  it('should render link with calendar info', () => {
    const startDateTime = moment('2020-01-02');
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description="Follow-up/Routine: some description"
        location="123 main street, bozeman, MT"
        duration={60}
        startDateTime={startDateTime.toDate()}
      />,
    );

    expect(screen.getByRole('link')).to.contain.text('Add to calendar');
    expect(screen.getByRole('link')).to.have.attribute(
      'download',
      'VA_Appointment.ics',
    );
    expect(screen.getByRole('link')).to.have.attribute(
      'aria-label',
      `Add January 2, 2020 appointment to your calendar`,
    );
    const ics = decodeURIComponent(
      screen
        .getByRole('link')
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
        description="Follow-up/Routine: some description"
        location="Phone call"
        duration={60}
        startDateTime={startDateTime.toDate()}
      />,
    );

    expect(screen.getByRole('link')).to.contain.text('Add to calendar');
    expect(screen.getByRole('link')).to.have.attribute(
      'download',
      'VA_Appointment.ics',
    );
    expect(screen.getByRole('link')).to.have.attribute(
      'aria-label',
      `Add January 2, 2020 appointment to your calendar`,
    );
    const ics = decodeURIComponent(
      screen
        .getByRole('link')
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

  it('should propertly format long descriptions', () => {
    const startDateTime = moment('2020-01-02');
    const screen = render(
      <AddToCalendar
        summary="VA Appointment"
        description="Testing long line descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions Testing long descriptions"
        location="A location"
        duration={60}
        startDateTime={startDateTime.toDate()}
      />,
    );

    const ics = decodeURIComponent(
      screen
        .getByRole('link')
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    expect(ics).to.contain(
      'DESCRIPTION:Testing long line descriptions Testing long descriptions Testi\r\n\tng long descriptions Testing long descriptions Testing long descriptions T\r\n\testing long descriptions Testing long descriptions Testing long descriptio\r\n\tns\r\n',
    );
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
