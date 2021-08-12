import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import { mockFetch, setFetchJSONFailure } from 'platform/testing/unit/helpers';
import reducers from '../../../redux/reducer';
import {
  getCCAppointmentMock,
  getVAAppointmentMock,
  getVAFacilityMock,
} from '../../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import {
  getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import UpcomingAppointmentsList from '../../../appointment-list/components/UpcomingAppointmentsList';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { getVAOSAppointmentMock } from '../../mocks/v2';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingHomepageRefresh: true,
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: moment().format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    };
    mockFacilitiesFetch('vha_442GC', [facility]);

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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: moment().format(),
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch();

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
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'NO-SHOW';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any upcoming appointments/i),
    ).to.eventually.be.ok;
  });

  it('should not display when over 13 months away', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment()
      .add(14, 'months')
      .format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any upcoming appointments/i),
    ).to.eventually.be.ok;
  });

  it('should show error message when request fails', async () => {
    mockAppointmentInfo({});
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/appointment_requests?start_date=${moment()
          .add(-120, 'days')
          .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
      ),
      { errors: [] },
    );

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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'FUTURE' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch();
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'FUTURE' },
      tasInfo: {
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
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch();
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'MOBILE_GFE',
      status: { description: 'F', code: 'FUTURE' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch();
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'CLINIC_BASED',
      status: { description: 'F', code: 'FUTURE' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'STORE_FORWARD',
      status: { description: 'F', code: 'FUTURE' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
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

    mockAppointmentInfo({ cc: [appointment], isHomepageRefresh: true });
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

    mockAppointmentInfo({ cc: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    expect(screen.baseElement).to.contain.text('Big sky medical');
  });

  it('should show community care text for VistA cc appointments', async () => {
    const startDate = moment().add(1, 'days');
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      communityCare: true,
      facilityId: '983',
      sta6aid: '983GC',
      vdsAppointments: { bookingNote: 'scheduler note' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
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
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      facilityId: '983',
      sta6aid: '983GC',
      phoneOnly: true,
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch();
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
      isHomepageRefresh: true,
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
  });
  afterEach(() => {});

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
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
    };

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetch();
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    expect(screen.baseElement).to.contain.text('VA appointment');
  });

  it('should show CC appointment text', async () => {
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

    mockFacilitiesFetch();
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

    mockFacilitiesFetch();
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

    mockFacilitiesFetch();
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
    };

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockFacilitiesFetch();
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsList />, {
      initialState: myInitialState,
      reducers,
    });

    await screen.findByText(new RegExp(now.format('dddd, MMMM D'), 'i'));
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('Community care');
  });
});
