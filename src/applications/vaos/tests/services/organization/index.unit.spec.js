import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getOrganizations } from '../../../services/organization';
import facilities from '../../../api/facilities.json';

const facilitiesParsed = facilities.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Organization service', () => {
  describe('getOrganizations', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities);
      data = await getOrganizations(['983', '984']);

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/facilities?facility_codes[]=983&facility_codes[]=984',
      );
      expect(data.entry[0].identifier[0].value).to.equal(
        facilitiesParsed[0].id,
      );
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getOrganizations(['983', '984']);
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/facilities?facility_codes[]=983&facility_codes[]=984',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
