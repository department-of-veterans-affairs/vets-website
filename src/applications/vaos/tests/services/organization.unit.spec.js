import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getOrganizations } from '../../services/organization';
import facilities from '../../api/facilities.json';

const facilitiesParsed = facilities.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Organization service', () => {
  describe('getOrganizations', () => {
    let data;

    describe('successful response', () => {
      before(async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, facilities);
        data = await getOrganizations(['983', '984']);
      });

      it('should map id', () => {
        expect(data.entry[0].identifier[0].value).to.equal(
          facilitiesParsed[0].id,
        );
      });

      it('should map name', () => {
        expect(data.entry[0].name).to.equal(
          facilitiesParsed[0].authoritativeName,
        );
      });

      it('should map address', () => {
        expect(data.entry[1].address[0].city).to.equal(
          facilitiesParsed[1].city,
        );
        expect(data.entry[1].address[0].state).to.equal(
          facilitiesParsed[1].stateAbbrev,
        );
      });

      it('should map partOf field for non-root parents', () => {
        expect(data.entry[2].partOf.reference).to.equal('Organization/var983');
      });
    });

    describe('error response', () => {
      it('should return OperationOutcome', async () => {
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

        expect(error?.resourceType).to.equal('OperationOutcome');
      });
    });
  });
});
