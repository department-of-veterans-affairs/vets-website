import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPage from '../../../covid-19-vaccine/components/ConfirmationPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';
import { getICSTokens } from '../../../utils/calendar';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS vaccine flow <ConfirmationPage>', () => {
  it('should show confirmation details', async () => {
    const start = moment();
    const store = createTestStore({
      covid19Vaccine: {
        submitStatus: FETCH_STATUS.succeeded,
        newBooking: {
          data: {
            vaFacility: '983',
            clinicId: '455',
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
          clinics: {},
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

    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    expect(await screen.findByText(/Your appointment is confirmed/i)).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(start.format('MMMM D, YYYY [at] h:mm a'), 'i'),
      ),
    ).to.be.ok;
    expect(screen.baseElement).to.contain.text('Confirmed');
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
    expect(screen.getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Main phone:');
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(screen.getByTestId('add-to-calendar-link')).to.exist;

    expect(
      screen.getByTestId('review-your-appointments-link'),
    ).to.have.attribute('href', '/my-health/appointments/');
  });

  it('should redirect to home page if no form data', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    // Expect router to route to home page
    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/');
    });
  });

  it('should verify VA in person calendar ics file format', async () => {
    const start = moment().tz('America/Denver');
    const store = createTestStore({
      covid19Vaccine: {
        submitStatus: FETCH_STATUS.succeeded,
        newBooking: {
          data: {
            vaFacility: '983',
            clinicId: '455',
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
          clinics: {},
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

    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
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
    expect(tokens.get('SUMMARY')).to.equal(
      'Appointment at Cheyenne VA Medical Center',
    );

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results

    expect(description[0]).to.equal(
      'You have a health care appointment at Cheyenne VA Medical Cent',
    );
    expect(description[1]).to.equal('\ter');
    expect(description[2]).to.equal('\t\\n\\n2360 East Pershing Boulevard\\n');
    expect(description[3]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
    expect(description[4]).to.equal('\t307-778-7550\\n');
    expect(description[5]).to.equal(
      '\t\\nSign in to VA.gov to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal(
      '2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
    );
    expect(tokens.get('DTSTAMP')).to.equal(
      `${moment(start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTSTART')).to.equal(
      `${moment(start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTEND')).to.equal(
      `${moment(start)
        .utc()
        .add(30, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('END')).includes('VEVENT');
    expect(tokens.get('END')).includes('VCALENDAR');
  });
});
