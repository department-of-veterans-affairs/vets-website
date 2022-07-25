import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from 'platform/testing/unit/helpers';
import reducers from '../../../redux/reducer';
import { getCCAppointmentMock } from '../../mocks/v0';
import { mockAppointmentInfo } from '../../mocks/helpers';
import {
  getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import UpcomingAppointmentsList from '../../../appointment-list/components/UpcomingAppointmentsList';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { getVAOSAppointmentMock } from '../../mocks/v2';
import {
  createMockAppointmentByVersion,
  createMockFacilityByVersion,
} from '../../mocks/data';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';
import { VIDEO_TYPES } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS <UpcomingAppointmentsList>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });
  it('should show information without facility name', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: '308',
      start: startDate.format(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const timeHeader = screen.getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).not.to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should show information with facility name', async () => {
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: '308',
      start: moment().format(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });

    mockFacilitiesFetchByVersion({
      facilities: [
        createMockFacilityByVersion({
          id: '442GC',
          name: 'Cheyenne VA Medical Center',
          address: {
            postalCode: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            line: ['2360 East Pershing Boulevard'],
          },
          phone: '307-778-7550',
          version: 0,
        }),
      ],
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .format('dddd, MMMM D'),
        'i',
      ),
    );

    expect(
      screen.getByText(
        new RegExp(
          moment()
            .tz('America/Denver')
            .format('h:mm'),
          'i',
        ),
      ),
    ).to.exist;
    expect(await screen.findByText(/Cheyenne VA Medical Center/i)).to.exist;
    expect(screen.baseElement).not.to.contain.text('VA appointment');
  });

  it('should have correct status when previously cancelled', async () => {
    const data = {
      id: '1234',
      currentStatus: 'CANCELLED BY CLINIC',
      kind: 'clinic',
      clinic: '308',
      start: moment().format(),
      locationId: '983GC',
      status: 'booked',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    mockFacilitiesFetchByVersion({ version: 0 });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .format('dddd, MMMM D'),
        'i',
      ),
    );

    expect(
      screen.getByText(
        new RegExp(
          moment()
            .tz('America/Denver')
            .format('h:mm'),
          'i',
        ),
      ),
    ).to.exist;
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should not display when they have hidden statuses', () => {
    const data = {
      id: '1234',
      currentStatus: 'NO-SHOW',
      kind: 'clinic',
      start: moment().format(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any upcoming appointments/i),
    ).to.eventually.be.ok;
  });

  it('should not display when over 13 months away', () => {
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      start: moment()
        .add(14, 'months')
        .format(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any upcoming appointments/i),
    ).to.eventually.be.ok;
  });

  it('should show error message when request fails', async () => {
    mockAppointmentInfo({ vaError: true });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your upcoming appointments/i,
      ),
    ).to.be.ok;
  });

  it('should show at home video appointment text', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'telehealth',
      start: startDate.format(),
      locationId: '983GC',
      telehealth: { vvsKind: VIDEO_TYPES.adhoc },
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    mockFacilitiesFetchByVersion({ version: 0 });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const timeHeader = screen.getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('VA Video Connect at home');
  });

  it('should show ATLAS video appointment text', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'telehealth',
      start: startDate.format(),
      locationId: '983GC',
      telehealth: {
        vvsKind: VIDEO_TYPES.adhoc,
        atlas: {
          siteCode: '9931',
          slotId: 'Slot8',
          confirmationCode: '7VBBCA',
          address: {
            streetAddress: '114 Dewey Ave',
            city: 'Eureka',
            state: 'MT',
            zipCode: '59917',
            country: 'USA',
            longitude: null,
            latitude: null,
            additionalDetails: '',
          },
        },
      },
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    mockFacilitiesFetchByVersion({ version: 0 });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const timeHeader = screen.getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect at an ATLAS location',
    );
  });

  it('should show video appointment on gfe text', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'telehealth',
      start: startDate.format(),
      locationId: '983GC',
      telehealth: { vvsKind: VIDEO_TYPES.gfe },
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    mockFacilitiesFetchByVersion({ version: 0 });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const timeHeader = screen.getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect using a VA device',
    );
  });

  it('should show video appointment at VA location text', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'telehealth',
      start: startDate.format(),
      locationId: '983GC',
      telehealth: { vvsKind: VIDEO_TYPES.clinic },
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const timeHeader = screen.getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect at a VA location',
    );
  });

  it('should show video appointment at VA location text for store forward appointment', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'telehealth',
      start: startDate.format(),
      locationId: '983GC',
      telehealth: { vvsKind: VIDEO_TYPES.storeForward },
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const timeHeader = screen.getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect at a VA location',
    );
  });

  it('should show community care provider text', async () => {
    const startDate = moment().add(1, 'days');
    const appointment = getCCAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      appointmentTime: startDate
        .clone()
        .add(5, 'hours')
        .format('MM/DD/YYYY HH:mm:ss'),
      timeZone: '-05:00 EST',
      instructionsToVeteran: 'Bring your glasses',
      address: {
        street: '123 Big Sky st',
        city: 'Bozeman',
        state: 'MT',
        zipCode: '59715',
      },
      name: { firstName: 'Jane', lastName: 'Doctor' },
      providerPractice: 'Big sky medical',
      providerPhone: '4065555555',
    };

    mockAppointmentInfo({ cc: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('ET');
    expect(timeHeader).to.contain.text('Eastern time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Jane Doctor');
  });

  it('should show community care practice name text', async () => {
    const startDate = moment().add(1, 'days');
    const appointment = getCCAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      appointmentTime: startDate
        .clone()
        .add(5, 'hours')
        .format('MM/DD/YYYY HH:mm:ss'),
      timeZone: '-05:00 EST',
      instructionsToVeteran: 'Bring your glasses',
      address: {
        street: '123 Big Sky st',
        city: 'Bozeman',
        state: 'MT',
        zipCode: '59715',
      },
      name: null,
      providerPractice: 'Big sky medical',
      providerPhone: '4065555555',
    };

    mockAppointmentInfo({ cc: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    expect(screen.baseElement).to.contain.text('Big sky medical');
  });

  it('should show community care text for VistA cc appointments', async () => {
    const startDate = moment().add(1, 'days');
    const data = {
      id: '1234',
      kind: 'cc',
      start: startDate.tz('America/Denver').format('YYYY-MM-DDTHH:mm:ss'),
      communityCareProvider: {},
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    expect(screen.baseElement).to.contain.text('Community care');
  });

  it('should show phone call appointment text', async () => {
    const startDate = moment();
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'phone',
      clinic: '308',
      start: startDate.format(),
      locationId: '983GC',
      telehealth: { vvsKind: VIDEO_TYPES.clinic },
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    mockFacilitiesFetchByVersion({ version: 0 });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Phone call');
  });

  it('should show error message when MAS returns partial results', async () => {
    mockAppointmentInfo({
      va: [],
      partialError: {
        code: '983',
        source: 'VIA',
        summary: 'something',
      },
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your upcoming appointments/i,
      ),
    ).to.be.ok;
  });
});

describe('VAOS <UpcomingAppointmentsList> V2 api', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
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

    await screen.findByText(
      new RegExp(now.tz('America/Denver').format('dddd, MMMM D'), 'i'),
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

    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
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

    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    expect(screen.baseElement).to.contain.text('VA Video Connect at home');
  });

  it('should show Phone appointment text', async () => {
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

    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    expect(screen.baseElement).to.contain.text('Phone call');
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

    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('Community care');
  });
});
