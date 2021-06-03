import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPage from '../../../covid-19-vaccine/components/ConfirmationPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingProjectCheetah: true,
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
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Main phone: 307-778-7580');
    expect(screen.getByText(/add to calendar/i)).to.have.tagName('a');

    userEvent.click(screen.getByText(/View your appointments/i));
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
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
    expect(tokens[5]).to.equal(
      'SUMMARY:Appointment at Cheyenne VA Medical Center',
    );

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You have a health care appointment at Cheyenne VA Medical Cent',
    );
    expect(tokens[7]).to.equal('\ter');
    expect(tokens[8]).to.equal('\t\\n\\n2360 East Pershing Boulevard\\n');
    expect(tokens[9]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
    expect(tokens[10]).to.equal('\t307-778-7550\\n');
    expect(tokens[11]).to.equal(
      '\t\\nSign in to VA.gov to get details about this appointment\\n',
    );

    expect(tokens[12]).to.equal(
      'LOCATION:2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
    );
    expect(tokens[13]).to.equal(
      `DTSTAMP:${moment(start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal(
      `DTSTART:${moment(start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal(
      `DTEND:${moment(start)
        .utc()
        .add(30, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[16]).to.equal('END:VEVENT');
    expect(tokens[17]).to.equal('END:VCALENDAR');
  });
});
