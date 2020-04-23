import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getSlots } from '../../../services/slot';
import slots from '../../../api/slots.json';

const slotsParsed = slots.data.map(s => ({
  ...s.attributes,
  id: s.id,
}));

describe('VAOS Slot service', () => {
  describe('getSlots', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, slots);
      data = await getSlots(983, 323, 308, '2020-05-01', '2020-06-30');

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=308&start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(data[0].start).to.equal(slotsParsed[0].startDateTime);
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getSlots(983, 323, 308, '2020-05-01', '2020-06-30');
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=308&start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
