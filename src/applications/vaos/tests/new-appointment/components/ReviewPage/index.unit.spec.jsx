import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import { FACILITY_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';
import {
  onCalendarChange,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
} from '../../../../new-appointment/redux/actions';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};
const parentFacilities = [
  {
    id: 'var983',
    identifier: [
      { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
      {
        system: 'http://med.va.gov/fhir/urn',
        value: 'urn:va:facility:983',
      },
    ],
  },
];
const facilityDetails = {
  var983: {
    id: 'var983',
    name: 'Cheyenne VA Medical Center',
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
  },
};
const facilities = {
  '323_var983': [
    {
      id: 'var983',
      name: 'Cheyenne VA Medical Center',
    },
  ],
};

describe('VAOS <ReviewPage>', () => {
  it('should render direct schedule view', async () => {
    const start = moment();
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'I need an appt',
          vaParent: 'var983',
          vaFacility: 'var983',
          clinicId: '455',
        },
        parentFacilities,
        facilityDetails,
        facilities,
        clinics: {
          // eslint-disable-next-line camelcase
          var983_323: [
            {
              id: '455',
              serviceName: 'Some VA clinic',
            },
          ],
        },
      },
    });
    store.dispatch(startDirectScheduleFlow());
    store.dispatch(
      onCalendarChange({
        currentlySelectedDate: start.format(),
        selectedDates: [
          {
            datetime: start.format(),
          },
        ],
      }),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/scheduling a primary care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      clinicHeading,
      reasonHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'scheduling a primary care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('VA Appointment');

    expect(dateHeading).to.contain.text(
      start.format('dddd, MMMM DD, YYYY [at] h:mm a'),
    );

    expect(clinicHeading).to.contain.text('Some VA clinic');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');

    expect(reasonHeading).to.contain.text('Follow-up/Routine');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should render VA request view', async () => {
    const start = moment();
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          facilityType: FACILITY_TYPES.VAMC,
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'I need an appt',
          vaParent: 'var983',
          vaFacility: 'var983',
          visitType: 'telehealth',
        },
        parentFacilities,
        facilityDetails,
        clinics: {},
        facilities,
      },
    });
    store.dispatch(startRequestAppointmentFlow());
    store.dispatch(
      onCalendarChange({
        currentlySelectedDate: start.format('YYYY-MM-DD'),
        selectedDates: [
          {
            date: start.format('YYYY-MM-DD'),
            optionTime: 'AM',
          },
        ],
      }),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a primary care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      clinicHeading,
      reasonHeading,
      visitTypeHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'requesting a primary care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('VA Appointment');

    expect(dateHeading).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${start.format('MMMM DD, YYYY')} in the morning`,
    );

    expect(clinicHeading).to.contain.text('Cheyenne VA Medical Center');

    expect(reasonHeading).to.contain.text('Follow-up/Routine');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(visitTypeHeading).to.contain.text('How to be seen');
    expect(screen.baseElement).to.contain.text(
      'Telehealth (through VA Video Connect)',
    );

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should render Community Care request view', async () => {
    const start = moment();
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          facilityType: FACILITY_TYPES.COMMUNITY_CARE,
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonAdditionalInfo: 'I need an appt',
          communityCareSystemId: 'var983',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            practiceName: 'Community medical center',
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              street: '123 big sky st',
              city: 'Bozeman',
              state: 'MT',
              postalCode: '59715',
            },
          },
        },
        parentFacilities,
        facilityDetails: {},
        clinics: {},
        facilities: {},
      },
    });
    store.dispatch(startRequestAppointmentFlow(true));
    store.dispatch(
      onCalendarChange({
        currentlySelectedDate: start.format('YYYY-MM-DD'),
        selectedDates: [
          {
            date: start.format('YYYY-MM-DD'),
            optionTime: 'AM',
          },
        ],
      }),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a community care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      providerHeading,
      additionalHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'requesting a community care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('Community Care');

    expect(dateHeading).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${start.format('MMMM DD, YYYY')} in the morning`,
    );

    expect(providerHeading).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text('Community medical center');
    expect(screen.baseElement).to.contain.text('Jane Doe');
    expect(screen.baseElement).to.contain.text('123 big sky st');
    expect(screen.baseElement).to.contain.text('Bozeman, MT 59715');

    expect(additionalHeading).to.contain.text('Additional details');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });
  it('should return to appointment list page if no data', () => {});
});
