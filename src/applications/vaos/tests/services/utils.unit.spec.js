import { expect } from 'chai';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import { mapToFHIRErrors, fhirSearch } from '../../services/utils';
import mockData from '../../services/mocks/fhir/mock_organizations.json';

describe('VAOS Utils: FHIR ', () => {
  describe('mapToFHIRError', () => {
    it('should map errors', () => {
      const data = mapToFHIRErrors([
        {
          code: 'VAOS_400',
          detail: 'Error detail',
          source: {
            loadError: null,
          },
          status: '400',
          title: 'Bad Request',
        },
      ]);

      expect(data).to.deep.equal({
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'VAOS_400',
            diagnostics: 'Bad Request',
            source: {
              loadError: null,
            },
            details: {
              code: '400',
              text: 'Error detail',
            },
          },
        ],
      });
    });
  });

  describe('fhirSearch', () => {
    it('should search a FHIR resource and return results', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, mockData);
      const results = await fhirSearch({ query: 'Organization?id=test' });
      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v1/Organization?id=test',
      );
      expect(results.length).to.equal(2);
      expect(results[0].resourceType).to.equal('Organization');
    });
  });
});
