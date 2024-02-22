import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import reducers from '../../../redux/reducer';
import { getTestDate, renderWithStoreAndRouter } from '../../mocks/setup';
import UpcomingAppointmentsList from '../../../appointment-list/components/UpcomingAppointmentsList';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { getVAOSAppointmentMock } from '../../mocks/v2';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';

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

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetchByVersion({ version: 0 });
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

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetchByVersion({ version: 0 });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState: myInitialState,
      reducers,
    });

    // await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    await screen.findAllByLabelText(
      new RegExp(now.format('dddd, MMMM D'), 'i'),
    );
    expect(screen.baseElement).to.contain.text('Community care');
  });

  it.skip('should show at home video appointment text', async () => {
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

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetchByVersion({ version: 0 });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState: myInitialState,
      reducers,
    });
    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    expect(screen.baseElement).to.contain.text('VA Video Connect at home');
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

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetchByVersion({ version: 0 });
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

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetchByVersion({ version: 0 });
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

  // TODO: Verify if these v0 test are relevant and implement.
  it('should show information without facility name', async () => {});

  it('should show information with facility name', async () => {});

  it('should have correct status when previously cancelled', async () => {});

  it('should not display when they have hidden statuses', () => {});

  it('should not display when over 13 months away', () => {});

  it('should show error message when request fails', async () => {});

  it('should show ATLAS video appointment text', async () => {});

  it('should show video appointment on gfe text', async () => {});

  it('should show video appointment at VA location text', async () => {});

  it('should show video appointment at VA location text for store forward appointment', async () => {});

  it('should show community care provider text', async () => {});

  it('should show community care practice name text', async () => {});

  it('should show community care text for VistA cc appointments', async () => {});

  it('should show error message when MAS returns partial results', async () => {});
});
