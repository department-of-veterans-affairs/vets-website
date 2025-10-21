/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';

import { addDays, format, subDays } from 'date-fns';
import {
  fetchBookedAppointment,
  getAppointmentRequests,
  getLongTermAppointmentHistoryV2,
  getVAAppointmentLocationId,
  isValidPastAppointment,
  getLink,
} from '.';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import {
  getDateRanges,
  mockAppointmentApi,
  mockAppointmentsApi,
} from '../../tests/mocks/mockApis';
import { APPOINTMENT_TYPES, VIDEO_TYPES } from '../../utils/constants';

describe('VAOS Services: Appointment ', () => {
  // Global cleanup to ensure clean state for all tests
  beforeEach(() => {
    // Reset any global fetch state that might be lingering
    if (global.fetch && global.fetch.isSinonProxy) {
      global.fetch.resetHistory();
    }
  });

  afterEach(() => {
    // Ensure complete cleanup after each test
    if (global.fetch && global.fetch.isSinonProxy) {
      global.fetch.resetHistory();
    }
  });

  describe('fetchBookedAppointment by id', () => {
    beforeEach(() => mockFetch());

    afterEach(() => {
      resetFetch();
    });

    it('should return data for an in person VA appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createVAResponse(),
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

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

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a past VA appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VA phone appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VA covid vaccine appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a VVC at home video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createGfeResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for an ATLAS video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a clinic based video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createClinicResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a store forward video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createStoreForwardResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a mobile any video appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: addDays(new Date(), 3),
        })[0],
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

      expect(v2Result).to.be.ok;
    });

    it('should return data for a community care appointment', async () => {
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: MockAppointmentResponse.createCCResponse({
          localStartTime: addDays(new Date(), 3),
        }),
      });

      const v2Result = await fetchBookedAppointment({ id: '1' });

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
        await fetchBookedAppointment({ id: '1234' });
      } catch (e) {
        v2Result = e;
      }

      expect(v2Result).to.be.ok;
    });
  });

  describe('getAppointmentRequests', () => {
    beforeEach(() => mockFetch());

    afterEach(() => {
      resetFetch();
    });

    it('should return data for a VA appointment request', async () => {
      // Given VA appointment request
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);

      // And the developer fetched that request through both the v2 APIs
      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: MockAppointmentResponse.createVAResponses(),
      });

      const v2Result = await getAppointmentRequests({
        startDate: start,
        endDate: end,
      });

      // Then expect a VA appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for a CC appointment request', async () => {
      // Given CC appointment request
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);

      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: MockAppointmentResponse.createCCResponses(),
      });

      const v2Result = await getAppointmentRequests({
        startDate: start,
        endDate: end,
      });

      // Then expect a CC appointment request to be returned.
      expect(v2Result.length).to.be.gt(0);
    });

    it('should return data for a cancelled appointment request', async () => {
      // Given cancelled VA appointment request
      const start = subDays(new Date(), 30);
      const end = addDays(new Date(), 30);

      // And the developer fetched that request through both the v2 and v0 APIs
      mockAppointmentsApi({
        start,
        end,
        statuses: ['proposed', 'cancelled'],
        response: MockAppointmentResponse.createCCResponses(),
      });

      const v2Result = await getAppointmentRequests({
        startDate: start,
        endDate: end,
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
        await getAppointmentRequests({ startDate: start, endDate: end });
      } catch (e) {
        v2Result = e;
      }

      // Then expect an error to be returned.
      expect(v2Result).to.be.ok;
    });
  });

  describe('getLongTermAppointmentHistoryV2', () => {
    let originalUserAgent;

    beforeEach(() => {
      // Complete reset to ensure clean state
      resetFetch();
      mockFetch();

      // Force navigator.userAgent to node.js to ensure fresh function calls
      originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'node.js',
        writable: true,
      });

      // Verify the mock is properly set up
      if (!global.fetch || !global.fetch.isSinonProxy) {
        throw new Error('Mock fetch was not properly set up');
      }
    });

    afterEach(() => {
      // Restore navigator.userAgent
      if (originalUserAgent) {
        Object.defineProperty(navigator, 'userAgent', {
          value: originalUserAgent,
          writable: true,
        });
      }
      resetFetch();
    });

    it('should fetch 3 years of appointment history', async () => {
      // Verify clean starting state
      expect(global.fetch.callCount).to.equal(0);

      const dateRanges = getDateRanges(3);
      dateRanges.forEach(range => {
        mockAppointmentsApi({
          start: range.start,
          end: range.end,
          useRFC3339: false,
          response: [],
          statuses: [
            'booked',
            'arrived',
            'fulfilled',
            'cancelled',
            'checked-in',
          ],
        });
      });

      const initialCallCount = global.fetch.callCount;
      await getLongTermAppointmentHistoryV2();

      // Verify exactly 3 new calls were made
      expect(global.fetch.callCount - initialCallCount).to.equal(3);
      expect(global.fetch.firstCall.args[0]).to.contain(
        `${format(dateRanges[0].start, 'yyyy-MM-dd')}`,
      );
      expect(global.fetch.firstCall.args[0]).to.contain(
        `${format(dateRanges[0].end, 'yyyy-MM-dd')}`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        `${format(dateRanges[1].start, 'yyyy-MM-dd')}`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        `${format(dateRanges[1].end, 'yyyy-MM-dd')}`,
      );
      expect(global.fetch.thirdCall.args[0]).to.contain(
        `${format(dateRanges[2].start, 'yyyy-MM-dd')}`,
      );
      expect(global.fetch.thirdCall.args[0]).to.contain(
        `${format(dateRanges[2].end, 'yyyy-MM-dd')}`,
      );
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

  describe('getLink', () => {
    it('should return the correct link for a past appointment', () => {
      const appointment = {
        vaos: {
          isPastAppointment: true,
        },
        id: '123',
        modality: 'vaInPerson',
      };
      expect(getLink({ appointment })).to.equal('past/123');
    });

    it('should return the correct link for a CC appointment', () => {
      const appointment = {
        id: '123',
        vaos: {
          isPastAppointment: true,
        },
        modality: 'communityCareEps',
      };
      expect(getLink({ appointment })).to.equal('/123?eps=true');
      const futureAppointment = {
        id: '1234',
        vaos: {
          isPastAppointment: false,
        },
        modality: 'communityCareEps',
      };
      expect(getLink({ appointment: futureAppointment })).to.equal(
        '/1234?eps=true',
      );
    });

    it('should return the correct link for a future appointment', () => {
      const appointment = {
        id: '123',
        vaos: {
          isPastAppointment: false,
        },
        modality: 'vaInPerson',
      };
      expect(getLink({ appointment })).to.equal('/123');
    });
  });
});
