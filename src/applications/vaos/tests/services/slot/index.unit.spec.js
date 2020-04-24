import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getSlots } from '../../../services/slot';
import slots from '../../../api/slots.json';

describe('VAOS Slot service', () => {
  describe('getSlots', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, slots);

      data = await getSlots({
        vistaFacilityId: '983',
        vistaTypeOfCareId: '323',
        vistaClinicId: '308',
        startDate: '2020-05-01',
        endDate: '2020-06-30',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=308&start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(data[0].start).to.equal('2020-02-06T21:00:00Z');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getSlots({
          vistaFacilityId: '983',
          vistaTypeOfCareId: '323',
          vistaClinicId: '308',
          startDate: '2020-05-01',
          endDate: '2020-06-30',
        });
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
