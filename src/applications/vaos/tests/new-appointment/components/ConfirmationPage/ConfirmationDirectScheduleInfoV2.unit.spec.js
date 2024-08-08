import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPage from '../../../../new-appointment/components/ConfirmationPage';
import { getICSTokens } from '../../../../utils/calendar';
import { FETCH_STATUS, FLOW_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  // getTestDate,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

const start = moment().tz('America/Denver');
const end = moment(start).tz('America/Denver');
const store = createTestStore({
  ...initialState,
  newAppointment: {
    submitStatus: FETCH_STATUS.succeeded,
    flowType: FLOW_TYPES.DIRECT,
    data: {
      typeOfCareId: '323',
      phoneNumber: '1234567890',
      email: 'joeblow@gmail.com',
      reasonForAppointment: 'routine-follow-up',
      reasonAdditionalInfo: 'Additional info',
      vaParent: '983',
      vaFacility: '983',
      clinicId: '455',
      selectedDates: [start.format('YYYY-MM-DDTHH:mm:ss')],
    },
    availableSlots: [
      {
        start: start.format('YYYY-MM-DDTHH:mm:ss'),
        end: end.add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
      },
    ],
    parentFacilities: [
      {
        id: '983',
        identifier: [
          { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
          {
            system: 'http://med.va.gov/fhir/urn',
            value: 'urn:va:facility:983',
          },
        ],
      },
    ],
    clinics: {
      '983_323': [
        {
          id: '455',
          serviceName: 'CHY PC CASSIDY',
        },
      ],
    },
    facilities: {
      '323': [
        {
          id: '983',
          name: 'Cheyenne VA Medical Center',
          identifier: [
            { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
          ],
          address: {
            postalCode: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            line: ['2360 East Pershing Boulevard', undefined, 'Suite 10'],
          },
          telecom: [{ system: 'phone', value: '307-778-7550' }],
        },
      ],
    },
  },
});

describe('VAOS Page: ConfirmationPage', () => {
  it('should render appointment direct schedule view', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, { store });
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
    expect(screen.getByText('Primary care')).to.be.ok;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard, Suite 10/i)).to.be
      .ok;
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
    expect(screen.getByText(/Routine\/Follow-up/i)).to.be.ok;
    expect(screen.getByText(/Additional info/i)).to.be.ok;
    expect(screen.getByText(/CHY PC CASSIDY/i)).to.be.ok;

    expect(
      screen.getByTestId('add-to-calendar-link', {
        name: start.format('[Add] MMMM D, YYYY [appointment to your calendar]'),
      }),
    ).to.be.ok;

    expect(screen.getByTestId('print-button'));
  });

  // NOTE: This should be covered in e2e tests
  it('should render appointment list page when "Review your appointments" link is clicked', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, { store });
    expect(screen.getByTestId('review-appointments-link')).to.exist;
    expect(
      screen.getByTestId('review-appointments-link').getAttribute('href'),
    ).to.equal('/my-health/appointments/');
  });

  // NOTE This should be covered in e2e tests
  it('should render new appointment page when "Schedule a new appointment" link is clicked', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, { store });
    expect(screen.getByTestId('schedule-new-appointment-link')).to.exist;
  });

  it('should verify VA in person calendar ics file format', async () => {
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
    expect(tokens.get('SUMMARY')).to.equal('Appointment at CHY PC CASSIDY');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results
    expect(description[0]).to.equal(
      'You have a health care appointment at CHY PC CASSIDY',
    );
    expect(description[1]).to.equal('\t\\n\\n2360 East Pershing Boulevard\\n');
    expect(description[2]).to.equal(
      '\tSuite 10\\, Cheyenne\\, WY 82001-5356\\n',
    );
    expect(description[3]).to.equal('\t307-778-7550\\n');
    expect(description[4]).to.equal(
      '\t\\nSign in to VA.gov to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal(
      '2360 East Pershing Boulevard\\, Suite 10\\, Cheyenne\\, WY 82001-5356',
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
