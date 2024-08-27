import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import claimFoundResponse from '../../../services/mocks/v2/claims.json';
import { getClaim } from '../../../services/claim';

describe('Claim Service', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch, claimFoundResponse);
  });

  describe('getClaim', () => {
    const startDateTime = '2021-07-07T17:00:00Z';
    it('should make successful request', async () => {
      const response = await getClaim(startDateTime);

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/claims?date=${startDateTime}`,
      );
      expect(response).to.deep.equal(claimFoundResponse.data);
    });

    it('should return OperationOutcome error', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getClaim(startDateTime);
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/claims?date=${startDateTime}`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
