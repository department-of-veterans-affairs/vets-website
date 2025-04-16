import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { format, subDays, addDays } from 'date-fns';
import React from 'react';
import reducers from '../../../redux/reducer';
import {
  mockAppointmentsApi,
  mockVAOSAppointmentsFetch,
} from '../../../tests/mocks/helpers';
import { getVAOSAppointmentMock } from '../../../tests/mocks/mock';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import UpcomingAppointmentsPage from './UpcomingAppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS Component: UpcomingAppointmentsList', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });
  const now = new Date();
  const start = subDays(now, 30); // Subtract 30 days
  const end = addDays(now, 395); // Add 395 days

  it('should show VA appointment text, useFeSourceOfTruthVA=false', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      status: 'booked',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });

  it('should show VA appointment text, useFeSourceOfTruthVA=true', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      type: 'VA',
      status: 'booked',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });

  it('should show CC appointment text', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
        vaOnlineSchedulingStatusImprovement: false,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'cc',
      status: 'booked',
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Community care');
  });

  it('should show at home video appointment text', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
        vaOnlineSchedulingStatusImprovement: false,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'telehealth',
      type: 'VA',
      status: 'booked',
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      telehealth: { vvsKind: 'MOBILE_ANY' },
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });
    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Video');
  });

  it('should show phone appointment text', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
        vaOnlineSchedulingStatusImprovement: false,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'phone',
      type: 'VA',
      status: 'booked',
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );

    expect(screen.baseElement).to.contain.text('Phone');
  });

  it('should show cancelled appointment text', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
        vaOnlineSchedulingStatusImprovement: false,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'cc',
      status: 'cancelled',
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      name: { firstName: 'Jane', lastName: 'Doctor' },
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );

    expect(screen.findAllByLabelText(/canceled Community care/i));
    expect(screen.baseElement).to.contain.text('Community care');
  });
  it('should show VA appointment text for telehealth appointments without vvsKind', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
        vaOnlineSchedulingStatusImprovement: false,
      },
    };

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'telehealth',
      type: 'VA',
      status: 'booked',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      localStartTime: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
      future: true,
    };

    mockAppointmentsApi({
      start: format(subDays(now, 120), 'yyyy-MM-dd'), // Subtract 120 days
      end: format(now, 'yyyy-MM-dd'), // Current date
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByText('VA appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });
});
