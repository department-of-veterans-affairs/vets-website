import { expect } from 'chai';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import clinics from '../../api/clinicList983.json';
import confirmed from '../../api/confirmed_va.json';

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
      setFetchJSONResponse(global.fetch.onCall(4), confirmed);
      setFetchJSONResponse(global.fetch.onCall(5), confirmed);
      setFetchJSONResponse(global.fetch.onCall(6), confirmed);
      setFetchJSONResponse(global.fetch.onCall(7), confirmed);
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
        'directEnabled',
        'requestSupported',
        'directPastVisit',
        'clinics',
        'hasMatchingClinics',
        'pastAppointments',
      ]);

      expect(eligibilityData.hasMatchingClinics).to.be.true;
      expect('startDate' in eligibilityData.pastAppointments[0]).to.be.true;
      expect(eligibilityData.pastAppointments.length).to.be.greaterThan(0);
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
        'directEnabled',
        'requestSupported',
        'directPastVisit',
        'clinics',
        'hasMatchingClinics',
        'pastAppointments',
      ]);
    });

    it('should set hasMatchingClinics to false if there are no matching past appointments', async () => {
      setFetchJSONResponse(global.fetch, { data: [{}] });
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

      expect(eligibilityData.hasMatchingClinics).to.be.false;
      setFetchJSONResponse(global.fetch, clinics);
    });

    it('should set hasMatchingClinics to false if there are no matching appointments', async () => {
      const nonMatchingAppointment = {
        data: [
          {
            attributes: {
              clinicId: '456',
              facilityId: '123',
            },
          },
        ],
      };
      setFetchJSONResponse(global.fetch.onCall(4), nonMatchingAppointment);
      setFetchJSONResponse(global.fetch.onCall(5), nonMatchingAppointment);
      setFetchJSONResponse(global.fetch.onCall(6), nonMatchingAppointment);
      setFetchJSONResponse(global.fetch.onCall(7), nonMatchingAppointment);
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

      expect(eligibilityData.hasMatchingClinics).to.be.false;
      expect(eligibilityData.pastAppointments.length).to.equal(4);
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
        'directEnabled',
        'requestSupported',
        'directPastVisit',
        'clinics',
        'hasMatchingClinics',
        'pastAppointments',
      ]);
    });
  });
  describe('getEligibilityChecks', () => {
    it('should calculate failing statuses', () => {
      const eligibilityChecks = getEligibilityChecks({
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
      const eligibilityChecks = getEligibilityChecks({
        hasMatchingClinics: true,
        pastAppointments: [{}],
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
      const eligibilityChecks = getEligibilityChecks({
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
      const eligibilityChecks = getEligibilityChecks({
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
      setFetchJSONFailure(global.fetch, { errors: [{}] });
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
      ).to.equal(5);
      resetFetch();
    });

    it('should record failure events when ineligible', () => {
      recordEligibilityGAEvents(
        {
          pacTeam: [],
          clinics: [],
          directEnabled: true,
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

    it('should record only supported failure events', () => {
      recordEligibilityGAEvents(
        {
          pacTeam: [],
          clinics: [],
          directEnabled: true,
          directSupported: false,
          requestSupported: false,
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
      ).to.equal(2);
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
