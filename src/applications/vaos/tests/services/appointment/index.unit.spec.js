/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
  // eslint-disable-next-line import/no-unresolved
} from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  fetchBookedAppointment,
  getAppointmentRequests,
  getLongTermAppointmentHistoryV2,
  isUpcomingAppointmentOrRequest,
  isValidPastAppointment,
} from '../../../services/appointment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
} from '../../../utils/constants';
import moment from '../../../lib/moment-tz';
import { createMockAppointmentByVersion } from '../../mocks/data';
import {
  getDateRanges,
  mockVAOSAppointmentsFetch,
} from '../../mocks/helpers.v2';
import { generateAppointmentUrl } from '../../../utils/appointment';
import { setRequestedPeriod } from '../../mocks/helpers';

describe('VAOS Services: Appointment ', () => {
  describe('fetchBookedAppointment by id', () => {
    beforeEach(() => mockFetch());

    it('should return data for an in person VA appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        clinicFriendlyName: 'Friendly clinic name',
        serviceType: 'primaryCare',
        status: 'booked',
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a cancelled VA appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        status: 'cancelled',
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a past VA appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .subtract(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        status: 'booked',
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VA phone appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .subtract(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'phone',
        locationId: '552GA',
        clinic: '5544',
        status: 'booked',
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VA covid vaccine appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .subtract(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        status: 'booked',
        serviceType: 'covid',
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VVC at home video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.adhoc,
          url: 'testing',
        },
        practitioners: [
          {
            name: {
              family: 'Doe',
              given: ['Meg'],
            },
          },
        ],
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for an ATLAS video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.adhoc,
          url: 'testing',
          atlas: {
            siteCode: '1234',
            confirmationCode: 'A523',
            address: {
              streetAddress: '114 Dewey Ave',
              city: 'Eureka',
              state: 'MT',
              zipCode: '59917',
              country: 'USA',
              longitude: -115.1,
              latitude: 48.8,
            },
          },
        },
        practitioners: [
          {
            name: {
              family: 'Doe',
              given: ['Meg'],
            },
          },
        ],
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a clinic based video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        clinicId: '5544',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.clinic,
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a store forward video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        clinicId: '5544',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.storeForward,
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a mobile any video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.mobile,
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a mobile gfe video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.gfe,
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,

        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a community care appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        kind: 'cc',
        status: 'booked',
        minutesDuration: 60,
        communityCareProvider: {
          address: {
            line: ['1012 14TH ST NW STE 700'],
            city: 'WASHINGTON',
            state: 'DC',
            postalCode: '20005-3477',
          },
          providers: {
            name: {
              firstName: 'WILLIAM',
              lastName: 'CAMPBELL',
            },
          },
          treatmentSpecialty: 'Optometry',
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );

      const v2Result = await fetchBookedAppointment({
        id: data.id,
        useV2: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for an error fetching appointments', async () => {
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };
      setFetchJSONFailure(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/1234`)),
        {
          errors: [error],
        },
      );

      let v2Result = null;
      try {
        await fetchBookedAppointment({
          id: '1234',
          useV2: true,
        });
      } catch (e) {
        v2Result = e;
      }

      expect(v2Result).to.be.ok;
    });
  });

  describe('getAppointmentRequests', () => {
    beforeEach(() => mockFetch());

    it('should return data for a VA appointment request', async () => {
      // Given VA appointment request
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        phone: '2125551212',
        kind: 'clinic',
        locationId: '552GA',
        clinicFriendlyName: 'Friendly clinic name',
        requestedPeriods: [
          {
            start: `${moment().format('YYYY-MM-DD')}T00:00:00.000`,
            end: `${moment().format('YYYY-MM-DD')}T11:59:59.999`,
          },
        ],
        serviceType: 'primaryCare',
        status: 'proposed',
        visitType: 'Office Visit',
      };
      const startDate = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const endDate = moment()
        .add(30, 'days')
        .format('YYYY-MM-DD');

      // And the developer fetched that request through both the v2 APIs
      const url = generateAppointmentUrl(startDate, endDate, [
        'proposed',
        'cancelled',
      ]);

      setFetchJSONResponse(global.fetch.withArgs(sinon.match(url)), {
        data: [
          createMockAppointmentByVersion({
            version: 2,
            ...data,
            requestedPeriods: [
              {
                start: `${moment().format('YYYY-MM-DD')}T00:00:00Z`,
                end: `${moment().format('YYYY-MM-DD')}T11:59:59Z`,
              },
            ],
          }),
        ],
      });

      const v2Result = await getAppointmentRequests({
        startDate,
        endDate,
        useV2: true,
      });

      // Then expect a VA appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for a CC appointment request', async () => {
      // Given CC appointment request
      const data = {
        id: '1234',
        email: 'test@va.gov',
        phone: '2125551212',
        kind: 'cc',
        clinicFriendlyName: 'Friendly clinic name',
        requestedPeriods: [
          {
            start: `${moment().format('YYYY-MM-DD')}T00:00:00.000`,
            end: `${moment().format('YYYY-MM-DD')}T11:59:59.999`,
          },
        ],
        serviceType: 'primaryCare',
        status: 'proposed',
        typeOfCareId: 'CCPRMYRTNE',
        visitType: 'Office Visit',
      };
      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 2,
              ...data,
              requestedPeriods: [
                {
                  start: `${moment().format('YYYY-MM-DD')}T00:00:00Z`,
                  end: `${moment().format('YYYY-MM-DD')}T11:59:59Z`,
                },
              ],
            }),
          ],
        },
      );

      const v2Result = await getAppointmentRequests({
        startDate,
        endDate,
        useV2: true,
      });

      // Then expect a CC appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for a cancelled appointment request', async () => {
      // Given cancelled VA appointment request
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        phone: '2125551212',
        kind: 'clinic',
        locationId: '552GA',
        clinicFriendlyName: 'Friendly clinic name',
        requestedPeriods: [
          {
            start: `${moment().format('YYYY-MM-DD')}T00:00:00.000`,
            end: `${moment().format('YYYY-MM-DD')}T11:59:59.999`,
          },
        ],
        serviceType: 'primaryCare',
        status: 'cancelled',
        visitType: 'Office Visit',
      };
      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 2,
              ...data,
            }),
          ],
        },
      );

      const v2Result = await getAppointmentRequests({
        startDate,
        endDate,
        useV2: true,
      });

      // Then expect a canceled appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for an error fetching requests', async () => {
      // Given VAOS error
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };

      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONFailure(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          errors: [error],
        },
      );

      let v2Result = null;

      try {
        await getAppointmentRequests({
          startDate,
          endDate,
          useV2: true,
        });
      } catch (e) {
        v2Result = e;
      }

      // Then expect an error to be returned.
      expect(v2Result).to.be.ok;
    });
  });

  describe('getLongTermAppointmentHistoryV2', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should fetch 3 years of appointment history', async () => {
      const dateRanges = getDateRanges(3);
      dateRanges.forEach(range => {
        mockVAOSAppointmentsFetch({
          start: range.start,
          end: range.end,
          requests: [],
          statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        });
      });

      await getLongTermAppointmentHistoryV2();
      expect(global.fetch.callCount).to.equal(3);
      expect(global.fetch.firstCall.args[0]).to.contain(dateRanges[0].start);
      expect(global.fetch.firstCall.args[0]).to.contain(dateRanges[0].end);
      expect(global.fetch.secondCall.args[0]).to.contain(dateRanges[1].start);
      expect(global.fetch.secondCall.args[0]).to.contain(dateRanges[1].end);
      expect(global.fetch.thirdCall.args[0]).to.contain(dateRanges[2].start);
      expect(global.fetch.thirdCall.args[0]).to.contain(dateRanges[2].end);
    });
  });

  //--------

  const now = moment();
  describe('isUpcomingAppointmentOrRequest', () => {
    it('should filter future requests', () => {
      const apptRequests = [
        // canceled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // cancelled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().subtract(22, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // pending past - should filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future within 13 - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(
              now
                .clone()
                .add(395, 'days')
                .add(-1, 'days'),
              'AM',
            ),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(2, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future canceled - should not filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(3, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
      ];

      const filteredRequests = apptRequests.filter(
        isUpcomingAppointmentOrRequest,
      );

      expect(
        filteredRequests.filter(
          req => req.status === APPOINTMENT_STATUS.cancelled,
        ).length,
      ).to.equal(1);
      expect(
        filteredRequests.filter(
          req => req.status === APPOINTMENT_STATUS.pending,
        ).length,
      ).to.equal(3);
      expect(
        filteredRequests.filter(req => req.status === 'Booked').length,
      ).to.equal(0);
    });

    it('should filter future confirmed appointments', () => {
      const confirmedAppts = [
        // appointment more than 395 days should not show
        {
          start: '2099-04-30T05:35:00',
          facilityId: '984',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment less than 395 days should show
        {
          start: now
            .clone()
            .add(394, 'days')
            .format(),
          facilityId: '984',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment 30 min ago should show
        {
          start: now
            .clone()
            .subtract(30, 'minutes')
            .format(),
          facilityId: '984',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment more than 1 hour ago should not show
        {
          start: now
            .clone()
            .subtract(65, 'minutes')
            .format(),
          facilityId: '984',
          vaos: {
            isPastAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // video appointment less than 4 hours ago should show
        {
          start: now
            .clone()
            .subtract(230, 'minutes')
            .format(),
          vaos: {
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // video appointment more than 4 hours ago should not show
        {
          start: now
            .clone()
            .subtract(245, 'minutes')
            .format(),
          vaos: {
            isPastAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // appointment with status 'NO-SHOW' should not show
        {
          description: 'NO-SHOW',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment with status 'DELETED' should not show
        {
          description: 'DELETED',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
      ];

      const filteredConfirmed = confirmedAppts.filter(
        isUpcomingAppointmentOrRequest,
      );
      expect(filteredConfirmed.length).to.equal(3);
    });

    it('should filter out appointments with status in FUTURE_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...FUTURE_APPOINTMENTS_HIDDEN_SET].map(
        currentStatus => ({
          description: currentStatus,
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
          facilityId: '984',
        }),
      );

      const filtered = hiddenAppts.filter(isUpcomingAppointmentOrRequest);
      expect(hiddenAppts.length).to.equal(2);
      expect(filtered.length).to.equal(0);
    });

    it('should filter out video appointments with status in FUTURE_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...FUTURE_APPOINTMENTS_HIDDEN_SET].map(code => ({
        description: code,
        vaos: {
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
        },
      }));

      const filtered = hiddenAppts.filter(isUpcomingAppointmentOrRequest);
      expect(hiddenAppts.length).to.equal(2);
      expect(filtered.length).to.equal(0);
    });
  });

  // NOTE: Refactored v0 test
  describe('filterPastAppointments', () => {
    it('should not filter appointments that are not in hidden status set', () => {
      const appointments = [
        {
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        {
          description: 'NO-SHOW',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        {
          description: 'CHECKED IN',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
      ];

      const filtered = appointments.filter(isValidPastAppointment);

      expect(filtered.length).to.equal(3);
    });
  });
});
