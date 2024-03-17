import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { mockFetch, setFetchJSONFailure } from 'platform/testing/unit/helpers';
import reducers from '../../../redux/reducer';
import { mockAppointmentInfo } from '../../mocks/helpers';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import CanceledAppointmentsList from '../../../appointment-list/components/CanceledAppointmentsList';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';
import {
  createMockAppointmentByVersion,
  createMockFacilityByVersion,
} from '../../mocks/data';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe.skip('VAOS Component: CanceledAppointmentsList', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockFacilitiesFetchByVersion({ version: 0 });
  });
  afterEach(() => {
    MockDate.reset();
  });
  it('should show information without facility name', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
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
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
      kind: 'clinic',
      vvsKind: VIDEO_TYPES.clinic,
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
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.noshow,
      kind: 'clinic',
      start: moment().format(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });

  it('should not display when over 13 months away', () => {
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
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
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });

  it('should show error message when request fails', async () => {
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
    const data = {
      id: '1234',
      currentStatus: 'CANCELLED BY CLINIC',
      status: APPOINTMENT_STATUS.cancelled,
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
    const data = {
      id: '1234',
      currentStatus: 'CANCELLED BY CLINIC',
      status: APPOINTMENT_STATUS.cancelled,
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
    mockFacilitiesFetchByVersion({ ids: ['442'], version: 0 });
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
    const data = {
      id: '1234',
      currentStatus: 'CANCELLED BY CLINIC',
      status: APPOINTMENT_STATUS.cancelled,
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
    const data = {
      id: '1234',
      currentStatus: 'CANCELLED BY CLINIC',
      status: APPOINTMENT_STATUS.cancelled,
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

  it('should show phone call appointment text', async () => {
    const startDate = moment.utc();
    const data = {
      id: '1234',
      currentStatus: 'CANCELLED BY CLINIC',
      status: APPOINTMENT_STATUS.cancelled,
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
    mockFacilitiesFetchByVersion({ ids: ['442GC'], version: 0 });
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
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
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
    mockFacilitiesFetchByVersion({ ids: ['442GC'], version: 0 });
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
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
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
    mockFacilitiesFetchByVersion({ ids: ['442GC'], version: 0 });
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
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
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
    mockFacilitiesFetchByVersion({ ids: ['442GC'], version: 0 });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });

  it('should not show canceled appointment if more than 395 days ahead', async () => {
    const startDate = moment()
      .add(397, 'days')
      .utc();
    const data = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
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
    mockFacilitiesFetchByVersion({ ids: ['442GC'], version: 0 });
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });
});
