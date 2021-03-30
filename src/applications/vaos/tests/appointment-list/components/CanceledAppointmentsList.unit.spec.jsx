import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import reducers from '../../../redux/reducer';
import {
  getVAAppointmentMock,
  getVAFacilityMock,
  getVARequestMock,
} from '../../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import CanceledAppointmentsList from '../../../appointment-list/components/CanceledAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaExpressCare: true,
    vaExpressCareNew: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <CanceledAppointmentsList>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    resetFetch();
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
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
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
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
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

    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should not display when they have hidden statuses', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'NO-SHOW';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(screen.findByText(/You don’t have any appointments/i)).to
      .eventually.be.ok;
  });

  it('should not display when over 13 months away', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment()
      .add(14, 'months')
      .format();
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(screen.findByText(/You don’t have any appointments/i)).to
      .eventually.be.ok;
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

    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your canceled appointments/i,
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
      status: { description: 'F', code: 'CANCELLED BY CLINIC' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
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
      status: { description: 'F', code: 'CANCELLED BY CLINIC' },
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
    mockFacilitiesFetch('vha_442', []);
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
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
      status: { description: 'F', code: 'CANCELLED BY CLINIC' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
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
      status: { description: 'F', code: 'CANCELLED BY CLINIC' },
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show cancelled express care appointment text', async () => {
    const startDate = moment.utc();
    const appointment = getVARequestMock();
    appointment.attributes = {
      ...appointment.attributes,
      status: 'Cancelled',
      date: startDate,
      optionDate1: startDate,
      optionTime1: 'AM',
      purposeOfVisit: 'New Issue',
      bestTimetoCall: ['Morning'],
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      typeOfCareId: 'CR1',
      reasonForVisit: 'Back pain',
      friendlyLocationName: 'Some VA medical center',
      appointmentType: 'Express Care',
      comment: 'loss of smell',
      facility: {
        ...appointment.attributes.facility,
        facilityCode: '983GC',
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });

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
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/New_York').format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).not.to.contain.text(
      'A VA health care provider will follow up with you today.',
    );
    expect(screen.baseElement).to.contain.text('Express Care request');
  });

  it('should show phone call appointment text', async () => {
    const startDate = moment.utc();
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      facilityId: '983',
      sta6aid: '983GC',
      phoneOnly: true,
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch('vha_442GC', []);
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    await screen.findByText(
      new RegExp(startDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Phone call');
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show canceled appointment from past if less than 30 days ago', async () => {
    const startDate = moment()
      .subtract(28, 'days')
      .utc();
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch('vha_442GC', []);
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should show canceled appointment from past if less than 395 days ahead', async () => {
    const startDate = moment()
      .add(393, 'days')
      .utc();
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch('vha_442GC', []);
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
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
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should not show canceled appointment from past if more than 30 days ago', async () => {
    const startDate = moment()
      .subtract(32, 'days')
      .utc();
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch('vha_442GC', []);
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(screen.findByText(/You don’t have any appointments/i)).to
      .eventually.be.ok;
  });

  it('should not show canceled appointment if more than 395 days ahead', async () => {
    const startDate = moment()
      .add(397, 'days')
      .utc();
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });
    mockFacilitiesFetch('vha_442GC', []);
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(screen.findByText(/You don’t have any appointments/i)).to
      .eventually.be.ok;
  });
});
