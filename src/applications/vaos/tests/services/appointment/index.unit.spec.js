import { expect } from 'chai';
import moment from 'moment';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getBookedAppointments } from '../../../services/appointment';
import confirmed from '../../../api/confirmed_va.json';

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
    });
  });
});
