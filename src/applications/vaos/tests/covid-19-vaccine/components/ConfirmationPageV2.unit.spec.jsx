import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPageV2 from '../../../covid-19-vaccine/components/ConfirmationPageV2';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingProjectCheetah: true,
  },
};

const start = moment();
const store = createTestStore({
  covid19Vaccine: {
    submitStatus: FETCH_STATUS.succeeded,
    newBooking: {
      data: {
        vaFacility: '983',
        clinicId: '983_455',
        date1: [start.format()],
      },
      availableSlots: [
        {
          start: start.format(),
          end: start
            .clone()
            .add(30, 'minutes')
            .format(),
        },
      ],
      clinics: {
        '983': [
          {
            id: '983_455',
            serviceName: 'CHY PC CASSIDY',
          },
        ],
      },
      facilities: [
        {
          id: '983',
          name: 'Cheyenne VA Medical Center',
          address: {
            postalCode: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            line: ['2360 East Pershing Boulevard'],
          },
          telecom: [
            {
              system: 'phone',
              value: '307-778-7550',
            },
          ],
        },
      ],
    },
  },
});

describe('VAOS vaccine flow <ConfirmationPageV2>', () => {
  it('should show confirmation details', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, { store });

    expect(
      await screen.findByText(
        /Your appointment has been scheduled and is confirmed./i,
      ),
    ).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(start.format('MMMM D, YYYY [at] h:mm a'), 'i'),
      ),
    ).to.be.ok;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Main phone: 307-778-7550');
    expect(screen.getByText(/add to calendar/i)).to.have.tagName('a');
  });

  it('should display links to view appointments and restart appointment flow', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, { store });
    expect(
      await screen.findByText(
        /Your appointment has been scheduled and is confirmed./i,
      ),
    ).to.be.ok;
    userEvent.click(screen.getByText(/View your appointments/i));
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
    userEvent.click(screen.getByText(/New appointment/i));
    expect(screen.history.push.getCall(1).args[0]).to.equal('/new-appointment');
  });

  it('should redirect to home page if no form data', async () => {
    const emptyStore = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, {
      store: emptyStore,
    });

    // Expect router to route to home page
    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/');
    });
  });

  it('should verify VA in person calendar ics file format', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, {
      store,
    });

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${start.format(
            'MMMM D, YYYY',
          )} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    // TODO: Debugging
    // console.log(tokens);

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');
    expect(tokens[5]).to.equal('SUMMARY:Appointment at CHY PC CASSIDY');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You have a health care appointment at CHY PC CASSIDY',
    );
    expect(tokens[7]).to.equal('\t\\n\\n2360 East Pershing Boulevard\\n');
    expect(tokens[8]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
    expect(tokens[9]).to.equal('\t307-778-7550\\n');
    expect(tokens[10]).to.equal(
      '\t\\nSign in to VA.gov to get details about this appointment\\n',
    );

    expect(tokens[11]).to.equal(
      'LOCATION:2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
    );
    expect(tokens[12]).to.equal(
      `DTSTAMP:${moment(start)
        .tz('America/Denver', true) // Only change the timezone and not the time
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[13]).to.equal(
      `DTSTART:${moment(start)
        .tz('America/Denver', true) // Only change the timezone and not the time
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal(
      `DTEND:${moment(start)
        .tz('America/Denver', true) // Only change the timezone and not the time
        .utc()
        .add(30, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal('END:VEVENT');
    expect(tokens[16]).to.equal('END:VCALENDAR');
  });
});
