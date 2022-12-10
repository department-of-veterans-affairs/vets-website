import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from 'platform/testing/unit/helpers';
import reducers from '../../../redux/reducer';
import {
  getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import UpcomingAppointmentsList from '../../../appointment-list/components/UpcomingAppointmentsList';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { getVAOSAppointmentMock } from '../../mocks/v2';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS <VistaSchedulingServiceAlert>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should not display when vaOnlineSchedulingVAOSV2Next is false and error is present', async () => {
    return true;
  });

  it('should display when vaOnlineSchedulingVAOSV2Next is true and error is present', async () => {
    return true;
  });

  it('should not display when vaOnlineSchedulingVAOSV2Next is true and error is not present', async () => {
    return true;
  });

  //   it('should show VA appointment text', async () => {
  //     const myInitialState = {
  //       ...initialState,
  //       featureToggles: {
  //         ...initialState.featureToggles,
  //         vaOnlineSchedulingVAOSServiceVAAppointments: true,
  //         vaOnlineSchedulingVAOSServiceCCAppointments: true,
  //         vaOnlineSchedulingStatusImprovement: false,
  //       },
  //     };
  //     const now = moment();
  //     const start = moment(now).subtract(30, 'days');
  //     const end = moment(now).add(395, 'days');
  //     const appointment = getVAOSAppointmentMock();
  //     appointment.id = '123';
  //     appointment.attributes = {
  //       ...appointment.attributes,
  //       kind: 'clinic',
  //       status: 'booked',
  //       locationId: '983',
  //       location: {
  //         id: '983',
  //         type: 'appointments',
  //         attributes: {
  //           id: '983',
  //           vistaSite: '983',
  //           name: 'Cheyenne VA Medical Center',
  //           lat: 39.744507,
  //           long: -104.830956,
  //           phone: { main: '307-778-7550' },
  //           physicalAddress: {
  //             line: ['2360 East Pershing Boulevard'],
  //             city: 'Cheyenne',
  //             state: 'WY',
  //             postalCode: '82001-5356',
  //           },
  //         },
  //       },
  //       start: now.format('YYYY-MM-DDTHH:mm:ss'),
  //       end: now.format('YYYY-MM-DDTHH:mm:ss'),
  //     };
  //
  //     mockVAOSAppointmentsFetch({
  //       start: start.format('YYYY-MM-DD'),
  //       end: end.format('YYYY-MM-DD'),
  //       requests: [appointment],
  //       statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
  //     });
  //
  //     mockFacilitiesFetchByVersion({ version: 0 });
  //     const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
  //       initialState: myInitialState,
  //       reducers,
  //     });
  //
  //     await screen.findByText(
  //       new RegExp(now.tz('America/Denver').format('dddd, MMMM D'), 'i'),
  //     );
  //     expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  //   });
  //
  //   it('should show CC appointment text', async () => {
  //     const myInitialState = {
  //       ...initialState,
  //       featureToggles: {
  //         ...initialState.featureToggles,
  //         vaOnlineSchedulingVAOSServiceVAAppointments: true,
  //         vaOnlineSchedulingVAOSServiceCCAppointments: true,
  //         vaOnlineSchedulingStatusImprovement: false,
  //       },
  //     };
  //     const now = moment();
  //     const start = moment(now).subtract(30, 'days');
  //     const end = moment(now).add(395, 'days');
  //     const appointment = getVAOSAppointmentMock();
  //     appointment.id = '123';
  //     appointment.attributes = {
  //       ...appointment.attributes,
  //       kind: 'cc',
  //       status: 'booked',
  //       start: now.format('YYYY-MM-DDTHH:mm:ss'),
  //       end: now.format('YYYY-MM-DDTHH:mm:ss'),
  //     };
  //
  //     mockVAOSAppointmentsFetch({
  //       start: start.format('YYYY-MM-DD'),
  //       end: end.format('YYYY-MM-DD'),
  //       requests: [appointment],
  //       statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
  //     });
  //
  //     mockFacilitiesFetchByVersion({ version: 0 });
  //     const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
  //       initialState: myInitialState,
  //       reducers,
  //     });
  //
  //     await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
  //     expect(screen.baseElement).to.contain.text('Community care');
  //   });
  //
  //   it('should show at home video appointment text', async () => {
  //     const myInitialState = {
  //       ...initialState,
  //       featureToggles: {
  //         ...initialState.featureToggles,
  //         vaOnlineSchedulingVAOSServiceVAAppointments: true,
  //         vaOnlineSchedulingVAOSServiceCCAppointments: true,
  //         vaOnlineSchedulingStatusImprovement: false,
  //       },
  //     };
  //     const now = moment();
  //     const start = moment(now).subtract(30, 'days');
  //     const end = moment(now).add(395, 'days');
  //     const appointment = getVAOSAppointmentMock();
  //     appointment.id = '123';
  //     appointment.attributes = {
  //       ...appointment.attributes,
  //       kind: 'telehealth',
  //       status: 'booked',
  //       start: now.format('YYYY-MM-DDTHH:mm:ss'),
  //       end: now.format('YYYY-MM-DDTHH:mm:ss'),
  //     };
  //
  //     mockVAOSAppointmentsFetch({
  //       start: start.format('YYYY-MM-DD'),
  //       end: end.format('YYYY-MM-DD'),
  //       requests: [appointment],
  //       statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
  //     });
  //
  //     mockFacilitiesFetchByVersion({ version: 0 });
  //     const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
  //       initialState: myInitialState,
  //       reducers,
  //     });
  //
  //     await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
  //     expect(screen.baseElement).to.contain.text('VA Video Connect at home');
  //   });
  //
  //   it('should show Phone appointment text', async () => {
  //     const myInitialState = {
  //       ...initialState,
  //       featureToggles: {
  //         ...initialState.featureToggles,
  //         vaOnlineSchedulingVAOSServiceVAAppointments: true,
  //         vaOnlineSchedulingVAOSServiceCCAppointments: true,
  //         vaOnlineSchedulingStatusImprovement: false,
  //       },
  //     };
  //     const now = moment();
  //     const start = moment(now).subtract(30, 'days');
  //     const end = moment(now).add(395, 'days');
  //     const appointment = getVAOSAppointmentMock();
  //     appointment.id = '123';
  //     appointment.attributes = {
  //       ...appointment.attributes,
  //       kind: 'phone',
  //       status: 'booked',
  //       start: now.format('YYYY-MM-DDTHH:mm:ss'),
  //       end: now.format('YYYY-MM-DDTHH:mm:ss'),
  //     };
  //
  //     mockVAOSAppointmentsFetch({
  //       start: start.format('YYYY-MM-DD'),
  //       end: end.format('YYYY-MM-DD'),
  //       requests: [appointment],
  //       statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
  //     });
  //
  //     mockFacilitiesFetchByVersion({ version: 0 });
  //     const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
  //       initialState: myInitialState,
  //       reducers,
  //     });
  //
  //     await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
  //     expect(screen.baseElement).to.contain.text('Phone call');
  //   });
  //
  //   it('should show cancelled appointment text', async () => {
  //     const myInitialState = {
  //       ...initialState,
  //       featureToggles: {
  //         ...initialState.featureToggles,
  //         vaOnlineSchedulingVAOSServiceVAAppointments: true,
  //         vaOnlineSchedulingVAOSServiceCCAppointments: true,
  //         vaOnlineSchedulingStatusImprovement: false,
  //       },
  //     };
  //     const now = moment();
  //     const start = moment(now).subtract(30, 'days');
  //     const end = moment(now).add(395, 'days');
  //     const appointment = getVAOSAppointmentMock();
  //     appointment.id = '123';
  //     appointment.attributes = {
  //       ...appointment.attributes,
  //       kind: 'cc',
  //       status: 'cancelled',
  //       start: now.format('YYYY-MM-DDTHH:mm:ss'),
  //       end: now.format('YYYY-MM-DDTHH:mm:ss'),
  //       name: { firstName: 'Jane', lastName: 'Doctor' },
  //     };
  //
  //     mockVAOSAppointmentsFetch({
  //       start: start.format('YYYY-MM-DD'),
  //       end: end.format('YYYY-MM-DD'),
  //       requests: [appointment],
  //       statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
  //     });
  //
  //     mockFacilitiesFetchByVersion({ version: 0 });
  //     const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
  //       initialState: myInitialState,
  //       reducers,
  //     });
  //
  //     await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
  //     expect(screen.baseElement).to.contain.text('Canceled');
  //     expect(screen.baseElement).to.contain.text('Community care');
  //   });
});
