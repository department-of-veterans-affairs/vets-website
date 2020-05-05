import { expect } from 'chai';
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

      const data = await getBookedAppointments({
        startDate: '2020-05-01',
        endDate: '2020-06-30',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/appointments?start_date=2020-05-01&end_date=2020-06-30&type=va',
      );
      expect(data[0].id).to.equal(`var${confirmed.data[0].id}`);
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getBookedAppointments({
          startDate: '2020-05-01',
          endDate: '2020-06-30',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/appointments?start_date=2020-05-01&end_date=2020-06-30&type=va',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
