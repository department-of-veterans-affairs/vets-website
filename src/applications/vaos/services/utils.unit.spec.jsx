import { expect } from 'chai';
import { mapToFHIRErrors } from './utils';

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
});
