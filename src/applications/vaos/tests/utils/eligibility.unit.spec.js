import { expect } from 'chai';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import clinics from '../../api/clinicList983.json';

import {
  isEligible,
  getEligibilityChecks,
  getEligibilityData,
  recordEligibilityGAEvents,
} from '../../utils/eligibility';

describe('VAOS scheduling eligibility logic', () => {
  describe('getEligibilityData', () => {
    before(() => {
      mockFetch();
    });

    beforeEach(() => {
      setFetchJSONResponse(global.fetch, clinics);
    });

    afterEach(() => {
      resetFetch();
    });

    it('should fetch all data', async () => {
      const eligibilityData = await getEligibilityData(
        {
          institutionCode: '983',
          directSchedulingSupported: true,
          requestSupported: true,
        },
        '323',
        '983',
        true,
      );

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
        'directSupported',
        'requestSupported',
        'directPastVisit',
        'clinics',
      ]);
    });
    it('should skip pact if not primary care', async () => {
      const eligibilityData = await getEligibilityData(
        {
          institutionCode: '983',
          directSchedulingSupported: true,
          requestSupported: true,
        },
        '502',
        '983',
        true,
      );

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
        'directSupported',
        'requestSupported',
        'directPastVisit',
        'clinics',
      ]);
    });
    it('should finish all calls even if one fails', async () => {
      setFetchJSONFailure(global.fetch.onCall(2), { errors: [{}] });
      const eligibilityData = await getEligibilityData(
        {
          institutionCode: '983',
          directSchedulingSupported: true,
          requestSupported: true,
        },
        '502',
        '983',
        true,
      );

      expect(Object.keys(eligibilityData)).to.deep.equal([
        'requestPastVisit',
        'requestLimits',
        'directSupported',
        'requestSupported',
        'directPastVisit',
        'clinics',
      ]);
    });
  });
  describe('getEligibilityChecks', () => {
    it('should calculate failing statuses', () => {
      const eligibilityChecks = getEligibilityChecks('983', '323', {
        clinics: [],
        directSupported: true,
        requestSupported: true,
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
        directFailed: false,
        requestFailed: false,
        directPastVisit: false,
        directPastVisitValue: 12,
        directClinics: false,
        requestPastVisit: false,
        requestPastVisitValue: 24,
        requestLimit: false,
        requestLimitValue: 1,
        directSupported: true,
        requestSupported: true,
      });
    });

    it('should calculate successful statuses', () => {
      const eligibilityChecks = getEligibilityChecks('983', '323', {
        clinics: [{}],
        directSupported: true,
        requestSupported: true,
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
        directFailed: false,
        requestFailed: false,
        directPastVisit: true,
        directPastVisitValue: 12,
        directClinics: true,
        directSupported: true,
        requestSupported: true,
        requestPastVisit: true,
        requestPastVisitValue: 24,
        requestLimit: true,
        requestLimitValue: 1,
      });
    });
    it('should skip direct status on direct failure', () => {
      const eligibilityChecks = getEligibilityChecks('983', '323', {
        pacTeam: [],
        clinics: [],
        directSupported: true,
        requestSupported: true,
        directPastVisit: {
          directFailed: true,
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
        directFailed: true,
        requestFailed: false,
        requestPastVisit: false,
        requestPastVisitValue: 24,
        requestLimit: false,
        requestLimitValue: 1,
        directSupported: true,
        requestSupported: true,
      });
    });
    it('should skip request status on request failure', () => {
      const eligibilityChecks = getEligibilityChecks('983', '323', {
        pacTeam: [],
        clinics: [],
        directSupported: true,
        requestSupported: true,
        directPastVisit: {
          durationInMonths: 12,
          hasVisitedInPastMonths: false,
        },
        requestPastVisit: {
          requestFailed: true,
        },
        requestLimits: {
          requestLimit: 1,
          numberOfRequests: 1,
        },
      });

      expect(eligibilityChecks).to.deep.equal({
        directFailed: false,
        directSupported: true,
        requestSupported: true,
        requestFailed: true,
        directPastVisit: false,
        directPastVisitValue: 12,
        directClinics: false,
      });
    });
  });
  describe('isEligible', () => {
    it('should return top level eligibility status', () => {
      const { direct, request } = isEligible({
        directPastVisit: false,
        directClinics: true,
        directSupported: true,
        requestSupported: true,
        requestPastVisit: true,
        requestLimit: true,
      });

      expect(direct).to.be.false;
      expect(request).to.be.true;
    });
  });

  describe('GA Events', () => {
    it('should record error events with fetch failures', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch.onCall(0), { errors: [{}] });
      setFetchJSONFailure(global.fetch.onCall(1), { errors: [{}] });
      setFetchJSONFailure(global.fetch.onCall(2), { errors: [{}] });
      setFetchJSONFailure(global.fetch.onCall(3), { errors: [{}] });
      setFetchJSONFailure(global.fetch.onCall(4), { errors: [{}] });
      await getEligibilityData(
        {
          institutionCode: '983',
          directSchedulingSupported: true,
          requestSupported: true,
        },
        '323',
        '983',
        true,
      );
      expect(
        global.window.dataLayer.filter(
          e =>
            e.event === 'vaos-error' &&
            e['error-key'].startsWith('eligibility-'),
        ).length,
      ).to.equal(4);
      resetFetch();
    });

    it('should record failure events when ineligible', () => {
      recordEligibilityGAEvents(
        {
          pacTeam: [],
          clinics: [],
          directSupported: true,
          requestSupported: true,
          directPastVisit: {
            durationInMonths: 12,
            hasVisitedInPastMonths: false,
          },
          requestPastVisit: {
            requestFailed: false,
          },
          requestLimits: {
            requestLimit: 1,
            numberOfRequests: 1,
          },
        },
        '323',
        '983',
      );
      expect(
        global.window.dataLayer.filter(e =>
          e.event.startsWith('vaos-eligibility-'),
        ).length,
      ).to.equal(4);
    });

    it('should not record failure events when ineligible', () => {
      recordEligibilityGAEvents(
        {
          pacTeam: [{ facilityId: '983' }],
          clinics: [{}],
          directSupported: true,
          requestSupported: true,
          directPastVisit: {
            durationInMonths: 12,
            hasVisitedInPastMonths: true,
          },
          requestPastVisit: {
            requestFailed: false,
            hasVisitedInPastMonths: true,
          },
          requestLimits: {
            requestLimit: 1,
            numberOfRequests: 0,
          },
        },
        '323',
        '983',
      );

      expect(global.window.dataLayer.length).to.equal(0);
    });
  });
});
