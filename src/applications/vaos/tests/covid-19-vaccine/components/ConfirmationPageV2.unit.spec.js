import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPageV2 from '../../../covid-19-vaccine/components/ConfirmationPageV2';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';
import { getICSTokens } from '../../../utils/calendar';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
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
            {
              system: 'covid',
              value: '307-778-7580',
            },
          ],
        },
      ],
    },
  },
});

describe('VAOS vaccine flow: ConfirmationPageV2', () => {
  it('should show confirmation details', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, { store });

    expect(
      await screen.findByText(
        /We’ve scheduled and confirmed your appointment./i,
      ),
    ).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(start.format('MMMM D, YYYY [at] h:mm a'), 'i'),
      ),
    ).to.be.ok;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
    expect(screen.getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(screen.getByTestId('add-to-calendar-link')).to.exist;
  });

  it('should display links to view appointments and restart appointment flow', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, { store });
    expect(
      await screen.findByText(
        /We’ve scheduled and confirmed your appointment./i,
      ),
    ).to.be.ok;
    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;

    expect(
      screen.queryByTestId('review-appointments-link').getAttribute('text'),
    ).to.equal('Review your appointments');
    expect(
      screen.queryByTestId('schedule-appointment-link').getAttribute('text'),
    ).to.equal('Schedule a new appointment');
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
        .getByTestId('add-to-calendar-link', {
          name: `Add ${start.format(
            'MMMM D, YYYY',
          )} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = getICSTokens(ics);

    expect(tokens.get('BEGIN')).includes('VCALENDAR');
    expect(tokens.get('VERSION')).to.equal('2.0');
    expect(tokens.get('PRODID')).to.equal('VA');
    expect(tokens.get('BEGIN')).includes('VEVENT');
    expect(tokens.has('UID')).to.be.true;
    expect(tokens.get('SUMMARY')).to.equal('Appointment at CHY PC CASSIDY');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results

    expect(description[0]).to.equal(
      'You have a health care appointment at CHY PC CASSIDY',
    );
    expect(description[1]).to.equal('\t\\n\\n2360 East Pershing Boulevard\\n');
    expect(description[2]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
    expect(description[3]).to.equal('\t307-778-7550\\n');
    expect(description[4]).to.equal(
      '\t\\nSign in to VA.gov to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal(
      '2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
    );
    expect(tokens.get('DTSTAMP')).to.equal(
      `${moment(start)
        .tz('America/Denver', true) // Only change the timezone and not the time
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTSTART')).to.equal(
      `${moment(start)
        .tz('America/Denver', true) // Only change the timezone and not the time
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTEND')).to.equal(
      `${moment(start)
        .tz('America/Denver', true) // Only change the timezone and not the time
        .utc()
        .add(30, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('END')).includes('VEVENT');
    expect(tokens.get('END')).includes('VCALENDAR');
  });
});
