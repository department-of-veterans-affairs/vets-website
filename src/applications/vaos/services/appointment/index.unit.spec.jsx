/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import MockDate from 'mockdate';

import { addDays, format, subDays } from 'date-fns';
import {
  fetchBookedAppointment,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  getAppointmentRequests,
  getLongTermAppointmentHistoryV2,
  getVAAppointmentLocationId,
  isUpcomingAppointmentOrRequest,
  isValidPastAppointment,
} from '.';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import {
  getDateRanges,
  mockAppointmentApi,
  mockAppointmentsApi,
} from '../../tests/mocks/mockApis';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
} from '../../utils/constants';

function setRequestedPeriod(date, amOrPm) {
  const isAM = amOrPm.toUpperCase() === 'AM';
  return {
    start: `${format(date, 'yyyy-MM-dd')}T${
      isAM ? '00:00:00.000Z' : `12:00:00.000Z`
    }`,
    end: `${format(date, 'yyyy-MM-dd')}T${
      isAM ? '11:59:59.999Z' : `23:59:59.999Z`
    }`,
  };
}

describe('VAOS Services: Appointment ', () => {
  describe('fetchBookedAppointment by id', () => {
    beforeEach(() => mockFetch());

    it('should return data for an in person VA appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createVAResponse(),
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
      expect(v2Result.vaos.apiData.modality).to.equal('vaInPerson');
    });

    it('should return data for a cancelled VA appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a past VA appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VA phone appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VA covid vaccine appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VVC at home video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createGfeResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for an ATLAS video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a clinic based video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createClinicResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a store forward video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createStoreForwardResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a mobile any video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a community care appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createCCResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({
        id: '1',
        useFeSourceOfTruth: true,
      });

      expect(v2Result).to.be.ok;
    });

    it('should return data for an error fetching appointments', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse(),
        responseCode: 404,
      });

      let v2Result = null;
      try {
        await fetchBookedAppointment({
          id: '1234',
          useFeSourceOfTruth: true,
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
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);
      const startDate = format(start, 'yyyy-MM-dd');
      const endDate = format(end, 'yyyy-MM-dd');

      // And the developer fetched that request through both the v2 APIs
      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: MockAppointmentResponse.createVAResponses(),
      });

      const v2Result = await getAppointmentRequests({
        startDate,
        endDate,
        useFeSourceOfTruth: true,
      });

      // Then expect a VA appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for a CC appointment request', async () => {
      // Given CC appointment request
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);
      const startDate = format(start, 'yyyy-MM-dd');
      const endDate = format(end, 'yyyy-MM-dd');

      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: MockAppointmentResponse.createCCResponses(),
      });

      const v2Result = await getAppointmentRequests({
        startDate,
        endDate,
        useFeSourceOfTruth: true,
      });

      // Then expect a CC appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for a cancelled appointment request', async () => {
      // Given cancelled VA appointment request
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);
      const startDate = format(start, 'yyyy-MM-dd');
      const endDate = format(end, 'yyyy-MM-dd');

      // And the developer fetched that request through both the v2 and v0 APIs
      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: MockAppointmentResponse.createCCResponses(),
      });

      const v2Result = await getAppointmentRequests({
        startDate,
        endDate,
        useFeSourceOfTruth: true,
      });

      // Then expect a canceled appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for an error fetching response', async () => {
      // Given VAOS error
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);
      const startDate = format(start, 'yyyy-MM-dd');
      const endDate = format(end, 'yyyy-MM-dd');

      // And the developer fetched that request through both the v2 and v0 APIs
      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: error,
        responseCode: 504,
      });

      let v2Result = null;

      try {
        await getAppointmentRequests({
          startDate,
          endDate,
          useFeSourceOfTruth: true,
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
        mockAppointmentsApi({
          start: range.start,
          end: range.end,
          useRFC3339: true,
          response: [],
          statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        });
      });

      await getLongTermAppointmentHistoryV2(true, true, true);
      expect(global.fetch.callCount).to.equal(3);
      expect(global.fetch.firstCall.args[0]).to.contain(
        `${dateRanges[0].start.toISOString().slice(0, 19)}Z`,
      );
      expect(global.fetch.firstCall.args[0]).to.contain(
        `${dateRanges[0].end.toISOString().slice(0, 19)}Z`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        `${dateRanges[1].start.toISOString().slice(0, 19)}Z`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        `${dateRanges[1].end.toISOString().slice(0, 19)}Z`,
      );
      expect(global.fetch.thirdCall.args[0]).to.contain(
        `${dateRanges[2].start.toISOString().slice(0, 19)}Z`,
      );
      expect(global.fetch.thirdCall.args[0]).to.contain(
        `${dateRanges[2].end.toISOString().slice(0, 19)}Z`,
      );
    });
  });

  //--------

  describe('isUpcomingAppointmentOrRequest', () => {
    MockDate.reset();
    const now = new Date();
    it('should filter future requests', () => {
      const apptRequests = [
        // canceled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [setRequestedPeriod(subDays(new Date(), 2), 'AM')],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // cancelled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [setRequestedPeriod(subDays(now, 22), 'AM')],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // pending past - should filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [setRequestedPeriod(subDays(now, 2), 'AM')],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future within 13 - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(subDays(addDays(new Date(), 395), 1), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [setRequestedPeriod(addDays(now, 2), 'AM')],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future canceled - should not filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [setRequestedPeriod(addDays(now, 3), 'AM')],
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
          facilityId: '984',
          vaos: {
            isUpcomingAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // appointment with status 'NO-SHOW' should not show
        {
          description: 'NO-SHOW',
          vaos: {
            isUpcomingAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // appointment with status 'DELETED' should not show
        {
          description: 'DELETED',
          vaos: {
            isUpcomingAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
      ];

      const filteredConfirmed = confirmedAppts.filter(
        isUpcomingAppointmentOrRequest,
      );
      expect(filteredConfirmed.length).to.equal(1);
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

  describe('getVAAppointmentLocationId', () => {
    it('should return null for undefined appointment', () => {
      expect(getVAAppointmentLocationId(undefined)).to.be.null;
    });

    it('should return 612A4 for Vista Site 612', () => {
      const appointment = {
        location: {
          vistaId: '612',
          stationId: '612Fake',
        },
        videoData: {
          kind: VIDEO_TYPES.mobile,
        },
        vaos: {
          isUpcomingAppointment: true,
          isVideo: true,
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
        },
      };
      expect(getVAAppointmentLocationId(appointment)).to.equal('612A4');
    });

    it('should return sta6aid for regular appointments', () => {
      const appointment = {
        location: {
          vistaId: '983',
          stationId: '983GC',
        },
        videoData: {
          kind: VIDEO_TYPES.mobile,
        },
        vaos: {
          isUpcomingAppointment: true,
          isVideo: true,
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
        },
      };
      expect(getVAAppointmentLocationId(appointment)).to.equal('983GC');
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
