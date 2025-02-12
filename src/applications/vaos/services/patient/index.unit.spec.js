import { expect } from 'chai';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { fetchPatientRelationships } from '.';

describe('VAOS Services: Patient ', () => {
  describe('fetchPatientRelationships', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should make successful request', async () => {
      const relationships = [
        {
          type: 'relationship',
          attributes: {
            type: 'string',
            attributes: {
              provider: {
                cernerId: 'Practitioner/123456',
                name: 'Doe, John D, MD',
              },
              location: {
                vhaFacilityId: 'string',
                name: 'Marion VA Clinic',
              },
              clinic: {
                vistaSite: '534',
                ien: '6569',
                name: 'Zanesville Primary Care',
              },
              serviceType: {
                coding: [
                  {
                    code: 'Routine Follow-up',
                  },
                ],
                text: 'string',
              },
              lastSeen: '2024-11-26T00:32:34.216Z',
              hasAvailability: false,
            },
          },
        },
      ];

      const typeOfCare = {
        idV2: 'foodAndNutrition',
      };

      setFetchJSONResponse(global.fetch, { data: relationships });

      const data = await fetchPatientRelationships('123', typeOfCare);

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/relationships`,
      );
      expect(data[0].providerName).to.equal('Doe, John D, MD');
    });
  });
});
