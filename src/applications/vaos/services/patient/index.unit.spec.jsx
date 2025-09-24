import { expect } from 'chai';
import { addDays } from 'date-fns';
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
            provider: {
              cernerId: 'Practitioner/123456',
              name: 'Doe, John D, MD',
            },
            location: {
              vhaFacilityId: '692',
              name: 'Marion VA Clinic',
            },

            serviceType: {
              coding: [
                {
                  system:
                    'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
                  code: 'foodAndNutrition',
                  display: 'Food and Nutrition',
                },
              ],
              text: 'Food and Nutrition',
            },
            lastSeen: '2024-11-26T00:32:34.216Z',
            hasAvailability: false,
          },
        },
      ];

      const typeOfCare = {
        idV2: 'foodAndNutrition',
      };

      setFetchJSONResponse(global.fetch, { data: relationships });

      const data = await fetchPatientRelationships(
        '123',
        typeOfCare,
        addDays(new Date(), 395),
      );

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/relationships`,
      );
      expect(data[0].providerName).to.equal('Doe, John D, MD');
    });
  });
});
