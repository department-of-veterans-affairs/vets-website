import { expect } from 'chai';

import {
  isEligible,
  getEligibilityChecks,
  getEligibilityData,
} from '../../utils/eligibility';

describe('VAOS scheduling eligibility logic', () => {
  describe('getEligibilityData', () => {
    it('should fetch all data', async () => {
      const eligibilityData = await getEligibilityData('983', '323');

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
        'directPastVisit',
        'clinics',
        'pacTeam',
      ]);
    });
    it('should skip direct fetches if not a matching type', async () => {
      const eligibilityData = await getEligibilityData('983', 'blah');

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
      ]);
    });
    it('should skip pact if not primary care', async () => {
      const eligibilityData = await getEligibilityData('983', '502');

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
        directTypes: true,
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
        directTypes: true,
        directPastVisit: true,
        directPastVisitValue: null,
        directPACT: true,
        directClinics: true,
        requestPastVisit: true,
        requestPastVisitValue: null,
        requestLimit: true,
        requestLimitValue: null,
      });
    });
  });
  describe('isEligible', () => {
    it('should return top level eligibility status', () => {
      const { direct, request } = isEligible({
        directPastVisit: false,
        directClinics: true,
        directTypes: true,
        directPACT: true,
        requestPastVisit: true,
        requestLimit: true,
      });

      expect(direct).to.be.false;
      expect(request).to.be.true;
    });
  });
});
