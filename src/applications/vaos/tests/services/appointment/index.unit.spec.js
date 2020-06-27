import { expect } from 'chai';
import moment from 'moment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getBookedAppointments,
  getAppointmentRequests,
} from '../../../services/appointment';
import confirmed from '../../../api/confirmed_va.json';
import requests from '../../../api/requests.json';

describe('VAOS Appointment service', () => {
  describe('getBookedAppointments', () => {
    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, confirmed);

      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      const data = await getBookedAppointments({
        startDate,
        endDate,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v0/appointments?start_date=${moment(
          startDate,
        ).toISOString()}&end_date=${moment(endDate).toISOString()}&type=va`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        '/vaos/v0/appointments?start_date=2020-05-01&end_date=2020-06-30&type=cc',
      );
      expect(data[0].status).to.equal('booked');
      resetFetch();
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });
      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      let error;
      try {
        await getBookedAppointments({
          startDate,
          endDate,
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v0/appointments?start_date=${moment(
          startDate,
        ).toISOString()}&end_date=${moment(endDate).toISOString()}&type=va`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        '/vaos/v0/appointments?start_date=2020-05-01&end_date=2020-06-30&type=cc',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
      resetFetch();
    });
  });

  describe('getAppointmentRequests', () => {
    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, requests);

      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      const data = await getAppointmentRequests({
        startDate,
        endDate,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/appointment_requests?start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(data[0].status).to.equal('pending');
      resetFetch();
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });
      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      let error;
      try {
        await getAppointmentRequests({
          startDate,
          endDate,
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/appointment_requests?start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
      resetFetch();
    });
  });
});
