import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';
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

  it('should show VA appointment text', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
      },
    };
    const now = moment();
    const start = moment(now).subtract(30, 'days');
    const end = moment(now).add(395, 'days');
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
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
      future: true,
    };

    mockAppointmentsApi({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
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
    const now = moment();
    const start = moment(now).subtract(30, 'days');
    const end = moment(now).add(395, 'days');
    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'cc',
      status: 'booked',
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
      future: true,
    };

    mockAppointmentsApi({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
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
    const now = moment();
    const start = moment(now).subtract(30, 'days');
    const end = moment(now).add(395, 'days');
    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'telehealth',
      type: 'VA',
      status: 'booked',
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
      telehealth: { vvsKind: 'MOBILE_ANY' },
      future: true,
    };

    mockAppointmentsApi({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });
    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
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
    const now = moment();
    const start = moment(now).subtract(30, 'days');
    const end = moment(now).add(395, 'days');
    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'phone',
      type: 'VA',
      status: 'booked',
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
      future: true,
    };

    mockAppointmentsApi({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
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
    const now = moment();
    const start = moment(now).subtract(30, 'days');
    const end = moment(now).add(395, 'days');
    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'cc',
      status: 'cancelled',
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
      name: { firstName: 'Jane', lastName: 'Doctor' },
      future: true,
    };

    mockAppointmentsApi({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
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
    const now = new Date();
    const start = subDays(now, 30);
    const end = addDays(now, 395);
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
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(now, 'yyyy-MM-dd'),
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
