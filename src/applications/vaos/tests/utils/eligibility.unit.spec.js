import { expect } from 'chai';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import clinics from '../../api/clinicList983.json';

import {
  isEligible,
  getEligibilityChecks,
  getEligibilityData,
} from '../../utils/eligibility';

describe('VAOS scheduling eligibility logic', () => {
  describe('getEligibilityData', () => {
    before(() => {
      mockFetch();
      setFetchJSONResponse(global.fetch, clinics);
    });
    after(() => {
      resetFetch();
    });
    it('should fetch all data', async () => {
      const eligibilityData = await getEligibilityData(
        '983',
        '323',
        '983',
        true,
      );

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
        'directPastVisit',
        'clinics',
        'pacTeam',
      ]);
    });
    it('should skip pact if not primary care', async () => {
      const eligibilityData = await getEligibilityData(
        '983',
        '502',
        '983',
        true,
      );

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
        'directPastVisit',
        'clinics',
      ]);
    });
  });
  describe('getEligibilityChecks', () => {
    it('should calculate failing statuses', () => {
      const eligibilityChecks = getEligibilityChecks('983', '323', {
        pacTeam: [],
        clinics: [],
        directPastVisit: {
          durationInMonths: 12,
          hasVisitedInPastMonths: false,
        },
        requestPastVisit: {
          durationInMonths: 24,
          hasVisitedInPastMonths: false,
        },
        requestLimits: {
          requestLimit: 1,
          numberOfRequests: 1,
        },
      });

      expect(eligibilityChecks).to.deep.equal({
        directPastVisit: false,
        directPastVisitValue: 12,
        directPACT: false,
        directClinics: false,
        requestPastVisit: false,
        requestPastVisitValue: 24,
        requestLimit: false,
        requestLimitValue: 1,
      });
    });

    it('should calculate successful statuses', () => {
      const eligibilityChecks = getEligibilityChecks('983', '323', {
        pacTeam: [{ facilityId: '983' }],
        clinics: [{}],
        directPastVisit: {
          durationInMonths: 12,
          hasVisitedInPastMonths: true,
        },
        requestPastVisit: {
          durationInMonths: 24,
          hasVisitedInPastMonths: true,
        },
        requestLimits: {
          requestLimit: 1,
          numberOfRequests: 0,
        },
      });

      expect(eligibilityChecks).to.deep.equal({
        directPastVisit: true,
        directPastVisitValue: 12,
        directPACT: true,
        directClinics: true,
        requestPastVisit: true,
        requestPastVisitValue: 24,
        requestLimit: true,
        requestLimitValue: 1,
      });
    });
  });
  describe('isEligible', () => {
    it('should return top level eligibility status', () => {
      const { direct, request } = isEligible({
        directPastVisit: false,
        directClinics: true,
        directPACT: true,
        requestPastVisit: true,
        requestLimit: true,
      });

      expect(direct).to.be.false;
      expect(request).to.be.true;
    });
  });
});
