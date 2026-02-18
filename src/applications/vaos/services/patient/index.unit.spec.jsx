import { expect } from 'chai';
import { addDays } from 'date-fns';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import {
  fetchPatientRelationships,
  hasEligibilityError,
  typeOfCareRequiresPastHistory,
} from '.';
import {
  INELIGIBILITY_CODES_VAOS,
  TYPE_OF_CARE_IDS,
} from '../../utils/constants';

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
      expect(data.patientProviderRelationships[0].providerName).to.equal(
        'Doe, John D, MD',
      );
    });

    it('should return null when fetch throws an error', async () => {
      global.fetch.rejects(new Error('Network error'));

      const typeOfCare = { idV2: 'foodAndNutrition' };
      const data = await fetchPatientRelationships(
        '123',
        typeOfCare,
        addDays(new Date(), 395),
      );

      expect(data).to.be.null;
    });

    it('should handle backend service failures in meta.failures', async () => {
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

      const failures = [
        {
          code: 'VAOS_500',
          details: 'Backend service error',
        },
      ];

      setFetchJSONResponse(global.fetch, {
        data: relationships,
        meta: { failures },
      });

      const typeOfCare = { idV2: 'foodAndNutrition' };
      const data = await fetchPatientRelationships(
        '123',
        typeOfCare,
        addDays(new Date(), 395),
      );

      expect(data.backendServiceFailures).to.deep.equal(failures);
      expect(data.patientProviderRelationships[0].providerName).to.equal(
        'Doe, John D, MD',
      );
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
  describe('typeOfCareRequiresPastHistory', () => {
    const {
      MENTAL_HEALTH_SERVICES_ID,
      PRIMARY_CARE,
      MENTAL_HEALTH_SUBSTANCE_USE_ID,
      FOOD_AND_NUTRITION_ID,
    } = TYPE_OF_CARE_IDS; // Should always require past history

    it('Should return true for MH Id when flipper on', () => {
      const result = typeOfCareRequiresPastHistory(
        MENTAL_HEALTH_SERVICES_ID,
        true,
      );
      expect(result).to.be.true;
    });

    it('Should return false for MH Id when flipper off', () => {
      // when flipper is false or undefined we do not want to check history - so this is correct
      const result = typeOfCareRequiresPastHistory(
        MENTAL_HEALTH_SERVICES_ID,
        false,
      );
      expect(result).to.be.false;
    });

    it('Should return false for PC Id no matter condition of MH flipper', () => {
      const result =
        typeOfCareRequiresPastHistory(PRIMARY_CARE, false) ||
        typeOfCareRequiresPastHistory(PRIMARY_CARE, true);
      expect(result).to.be.false;
    });

    it('Should return false for SUD Id no matter condition of MH flipper', () => {
      const result =
        typeOfCareRequiresPastHistory(MENTAL_HEALTH_SUBSTANCE_USE_ID, true) ||
        typeOfCareRequiresPastHistory(MENTAL_HEALTH_SUBSTANCE_USE_ID, false);
      expect(result).to.be.false;
    });
    it('Should return true for non-MH/PC/SUD Ids no matter condition of MH flipper', () => {
      const result =
        typeOfCareRequiresPastHistory(FOOD_AND_NUTRITION_ID, true) &&
        typeOfCareRequiresPastHistory(FOOD_AND_NUTRITION_ID, false);
      expect(result).to.be.true;
    });
  });
});
