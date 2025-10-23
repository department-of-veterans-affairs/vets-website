import { expect } from 'chai';
import { addDays } from 'date-fns';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { fetchPatientRelationships, hasEligibilityError } from '.';
import { INELIGIBILITY_CODES_VAOS } from '../../utils/constants';

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
  describe('hasEligibilityError', () => {
    it('hasEligibilityError should return true if ineligibility reason is present', () => {
      for (const [, code] of Object.entries(INELIGIBILITY_CODES_VAOS)) {
        const ineligibilityReasons = [
          {
            coding: [
              {
                code,
              },
            ],
          },
        ];
        expect(hasEligibilityError(ineligibilityReasons, code)).to.be.true;
      }
    });
    it('hasEligibilityError should return false if a different ineligibility reason is present', () => {
      const {
        REQUEST_LIMIT_EXCEEDED: code1,
        PATIENT_HISTORY_INSUFFICIENT: code2,
      } = INELIGIBILITY_CODES_VAOS;
      const ineligibilityReasons = [
        {
          coding: [
            {
              code: code1,
            },
          ],
        },
      ];
      expect(hasEligibilityError(ineligibilityReasons, code2)).to.be.false;
    });
    it('hasEligibilityError should be false for all reasons if undefined', () => {
      for (const [, code] of Object.entries(INELIGIBILITY_CODES_VAOS)) {
        expect(hasEligibilityError(undefined, code)).to.be.false;
      }
    });
  });
});
