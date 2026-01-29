import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  getAppointmentAvailabilityQueryFn,
  postAuthenticationQueryFn,
  postOTCVerificationQueryFn,
  postAppointmentQueryFn,
  getAppointmentQueryFn,
  getTopicsQueryFn,
  cancelAppointmentQueryFn,
} from './vassApi';

describe('VASS API', () => {
  beforeEach(() => {
    mockFetch();
  });

  describe('postAuthenticationQueryFn', () => {
    it('should successfully authenticate user', async () => {
      const mockResponse = {
        data: {
          message: 'OTC sent to registered email address',
          expiresIn: 600,
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await postAuthenticationQueryFn({
        uuid: 'test-uuid',
        lastname: 'Smith',
        dob: '1990-01-01',
      });

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include(
        '/vass/v0/authenticate',
      );
    });

    it('should handle authentication errors', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'invalid_credentials',
            detail: 'Unable to verify identity',
          },
        ],
      });

      const result = await postAuthenticationQueryFn({
        uuid: 'test-uuid',
        lastname: 'Wrong',
        dob: '1990-01-01',
      });

      expect(result.error).to.exist;
      expect(result.error.status).to.equal(500);
    });

    it('should send correct request body', async () => {
      const mockResponse = { data: { message: 'OTC sent' } };
      setFetchJSONResponse(global.fetch, mockResponse);

      await postAuthenticationQueryFn({
        uuid: 'test-uuid',
        lastname: 'Smith',
        dob: '1990-01-01',
      });

      const requestBody = JSON.parse(global.fetch.firstCall.args[1].body);
      expect(requestBody).to.deep.equal({
        uuid: 'test-uuid',
        lastname: 'Smith',
        dob: '1990-01-01',
      });
    });
  });

  describe('postOTCVerificationQueryFn', () => {
    it('should successfully verify OTC', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token-123',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await postOTCVerificationQueryFn({
        otc: '123456',
        uuid: 'test-uuid',
        lastname: 'Smith',
        dob: '1990-01-01',
      });

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include(
        '/vass/v0/authenticate-otc',
      );
    });

    it('should handle invalid OTC errors', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'invalid_otc',
            detail: 'Invalid or expired OTC',
            attemptsRemaining: 2,
          },
        ],
      });

      const result = await postOTCVerificationQueryFn({
        otc: 'wrong',
        uuid: 'test-uuid',
        lastname: 'Smith',
        dob: '1990-01-01',
      });

      expect(result.error).to.exist;
      expect(result.error.code).to.equal('invalid_otc');
    });
  });

  describe('postAppointmentQueryFn', () => {
    it('should successfully create appointment', async () => {
      const mockResponse = {
        data: {
          appointmentId: 'appt-123',
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await postAppointmentQueryFn({
        topics: [{ topicId: '1', topicName: 'Health' }],
        dtStartUtc: '2025-12-20T14:00:00Z',
        dtEndUtc: '2025-12-20T14:30:00Z',
      });

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include('/vass/v0/appointment');
    });

    it('should handle appointment already booked error', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'appointment_already_booked',
            detail: 'already scheduled',
            appointment: {
              appointmentId: 'existing-appt-id',
              dtStartUTC: '2025-12-20T14:00:00Z',
              dtEndUTC: '2025-12-20T14:30:00Z',
            },
          },
        ],
      });

      const result = await postAppointmentQueryFn({
        topics: [],
        dtStartUtc: '2025-12-20T14:00:00Z',
        dtEndUtc: '2025-12-20T14:30:00Z',
      });

      expect(result.error).to.exist;
      expect(result.error.status).to.equal(500);
    });

    it('should set Content-Type header to application/json', async () => {
      const mockResponse = { data: { appointmentId: 'appt-123' } };
      setFetchJSONResponse(global.fetch, mockResponse);

      await postAppointmentQueryFn({
        topics: [],
        dtStartUtc: '2025-12-20T14:00:00Z',
        dtEndUtc: '2025-12-20T14:30:00Z',
      });

      const { headers } = global.fetch.firstCall.args[1];
      expect(headers['Content-Type']).to.equal('application/json');
    });
  });

  describe('getAppointmentQueryFn', () => {
    it('should successfully fetch appointment by ID', async () => {
      const mockResponse = {
        data: {
          appointmentId: 'appt-123',
          topics: [{ topicId: '1', topicName: 'Health' }],
          dtStartUtc: '2025-12-20T14:00:00Z',
          dtEndUtc: '2025-12-20T14:30:00Z',
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await getAppointmentQueryFn({ appointmentId: 'appt-123' });

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include(
        '/vass/v0/appointment/appt-123',
      );
    });

    it('should handle not found errors', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'not_found',
            detail: 'Appointment not found',
            status: 404,
          },
        ],
      });

      const result = await getAppointmentQueryFn({
        appointmentId: 'invalid-id',
      });

      expect(result.error).to.exist;
      expect(result.error.status).to.equal(500);
    });
  });

  describe('getTopicsQueryFn', () => {
    it('should successfully fetch topics', async () => {
      const mockResponse = {
        data: {
          topics: [
            { topicId: '1', topicName: 'Health' },
            { topicId: '2', topicName: 'Benefits' },
          ],
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await getTopicsQueryFn();

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include('/vass/v0/topics');
    });

    it('should handle API errors gracefully', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'server_error',
            detail: 'Internal server error',
            status: 500,
          },
        ],
      });

      const result = await getTopicsQueryFn();

      expect(result.error).to.exist;
      expect(result.error.status).to.equal(500);
    });
  });

  describe('getAppointmentAvailabilityQueryFn', () => {
    it('should successfully fetch available time slots', async () => {
      const mockResponse = {
        data: {
          availableTimeSlots: [
            {
              dtStartUtc: '2025-12-15T14:00:00Z',
              dtEndUtc: '2025-12-15T14:30:00Z',
            },
          ],
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await getAppointmentAvailabilityQueryFn();

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include(
        '/vass/v0/appointment-availability',
      );
    });

    it('should handle API errors gracefully', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'server_error',
            detail: 'Internal server error',
            status: 500,
          },
        ],
      });

      const result = await getAppointmentAvailabilityQueryFn();

      expect(result.error).to.exist;
      expect(result.error.status).to.equal(500);
    });

    it('should set Content-Type header to application/json', async () => {
      const mockResponse = {
        data: {
          availableTimeSlots: [],
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      await getAppointmentAvailabilityQueryFn();

      const { headers } = global.fetch.firstCall.args[1];
      expect(headers['Content-Type']).to.equal('application/json');
    });
  });

  describe('cancelAppointmentQueryFn', () => {
    it('should successfully cancel appointment', async () => {
      const mockResponse = {
        data: {
          appointmentId: 'appt-123',
        },
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await cancelAppointmentQueryFn({
        appointmentId: 'appt-123',
      });

      expect(result).to.deep.equal(mockResponse);
      expect(global.fetch.firstCall.args[0]).to.include(
        '/vass/v0/appointment/appt-123/cancel',
      );
    });

    it('should handle cancel errors', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [
          {
            code: 'not_found',
            detail: 'Appointment not found',
            status: 404,
          },
        ],
      });

      const result = await cancelAppointmentQueryFn({
        appointmentId: 'invalid-id',
      });

      expect(result.error).to.exist;
      expect(result.error.status).to.equal(500);
    });
  });
});
