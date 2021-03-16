import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getSlots } from '../../../services/slot';
import slots from '../../../services/mocks/var/slots.json';
import vspSlots from '../../../services/mocks/fhir/mock_slots.json';

describe('VAOS Slot service', () => {
  describe('getSlots', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, slots);

      data = await getSlots({
        siteId: '983',
        typeOfCareId: '323',
        clinicId: '983_308',
        startDate: '2020-05-01',
        endDate: '2020-06-30',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=308&start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(data[0].start).to.equal('2020-02-06T14:00:00.000');
    });

    it('should make successful request to VSP endpoint', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, vspSlots);

      data = await getSlots({
        clinicId: '123123123',
        startDate: '2020-05-01',
        endDate: '2020-06-30',
        useVSP: true,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        'vaos/v1/Slot?schedule.actor=HealthcareService/123123123&start=lt2020-06-30&start=ge2020-05-01',
      );
      expect(data[0].start).to.equal('2020-08-07T20:00:00Z');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getSlots({
          siteId: '983',
          typeOfCareId: '323',
          clinicId: '983_308',
          startDate: '2020-05-01',
          endDate: '2020-06-30',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=308&start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
