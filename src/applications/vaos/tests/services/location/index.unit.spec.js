import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getLocations } from '../../../services/location';
import facilities983 from '../../../api/facilities_983.json';

const facilitiesParsed = facilities983.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Location service', () => {
  describe('getLocations', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities983);
      data = await getLocations({
        systemId: 'var983',
        parentId: 'var983A6',
        typeOfCareId: '123',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983A6',
      );
      expect(data[0].identifier[0].value).to.equal(facilitiesParsed[0].id);
    });

    describe('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocations({
          systemId: 'var983',
          parentId: 'var983A6',
          typeOfCareId: '123',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983A6',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
