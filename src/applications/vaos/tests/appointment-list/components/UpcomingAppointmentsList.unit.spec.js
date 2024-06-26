import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import reducers from '../../../redux/reducer';
import { getTestDate, renderWithStoreAndRouter } from '../../mocks/setup';
import UpcomingAppointmentsList from '../../../appointment-list/components/UpcomingAppointmentsList';
import {
  mockVAOSAppointmentsFetch,
  mockAppointmentsApi,
} from '../../mocks/helpers';
import { getVAOSAppointmentMock } from '../../mocks/mock';

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

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
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

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
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
      status: 'booked',
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
      telehealth: { vvsKind: 'MOBILE_ANY' },
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

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
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
      status: 'booked',
      localStartTime: now.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
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

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
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

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
    );

    expect(screen.findAllByLabelText(/canceled Community care/i));
    expect(screen.baseElement).to.contain.text('Community care');
  });
});
