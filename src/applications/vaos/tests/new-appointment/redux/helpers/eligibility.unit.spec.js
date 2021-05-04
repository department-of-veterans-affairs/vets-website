import { expect } from 'chai';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import clinics from '../../../../services/mocks/var/clinicList983.json';
import confirmed from '../../../../services/mocks/var/confirmed_va.json';

import {
  isEligible,
  getEligibilityData,
  recordEligibilityGAEvents,
} from '../../../../new-appointment/redux/helpers/eligibility';
import { VHA_FHIR_ID } from '../../../../utils/constants';

describe('VAOS scheduling eligibility logic', () => {
  describe('getEligibilityData', () => {
    beforeEach(() => {
      mockFetch();
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
          vistaId: '983',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
          legacyVAR: {
            directSchedulingSupported: true,
            requestSupported: true,
          },
        },
        { id: '322' },
        true,
      );

      expect(eligibilityData).to.have.all.keys(
        'requestPastVisit',
        'directSupported',
        'directEnabled',
        'requestSupported',
        'clinics',
        'hasMatchingClinics',
        'pastAppointments',
        'direct',
        'request',
      );

      expect(eligibilityData.hasMatchingClinics).to.be.true;
      expect('startDate' in eligibilityData.pastAppointments[0]).to.be.true;
      expect(eligibilityData.pastAppointments.length).to.be.greaterThan(0);
    });

    it('should not fetch past visits for primary care', async () => {
      setFetchJSONResponse(global.fetch, clinics);
      setFetchJSONResponse(global.fetch.onCall(2), confirmed);
      setFetchJSONResponse(global.fetch.onCall(3), confirmed);
      setFetchJSONResponse(global.fetch.onCall(4), confirmed);
      setFetchJSONResponse(global.fetch.onCall(5), confirmed);
      const eligibilityData = await getEligibilityData(
        {
          vistaId: '983',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
          legacyVAR: {
            directSchedulingSupported: true,
            requestSupported: true,
          },
        },
        { id: '323' },
        true,
      );

      expect(eligibilityData).to.have.all.keys(
        'directSupported',
        'directEnabled',
        'requestSupported',
        'clinics',
        'hasMatchingClinics',
        'pastAppointments',
        'request',
        'direct',
      );
      expect(eligibilityData.hasMatchingClinics).to.be.true;
      expect('startDate' in eligibilityData.pastAppointments[0]).to.be.true;
      expect(eligibilityData.pastAppointments.length).to.be.greaterThan(0);
    });

    it('should set hasMatchingClinics to false if there are no matching past appointments', async () => {
      setFetchJSONResponse(global.fetch, { data: [{}] });
      const eligibilityData = await getEligibilityData(
        {
          vistaId: '983',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
          legacyVAR: {
            directSchedulingSupported: true,
            requestSupported: true,
          },
        },
        { id: '322' },
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
      const eligibilityData = await getEligibilityData(
        {
          vistaId: '983',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
          legacyVAR: {
            directSchedulingSupported: true,
            requestSupported: true,
          },
        },
        { id: '322' },
        true,
      );

      expect(eligibilityData.hasMatchingClinics).to.be.false;
      expect(eligibilityData.pastAppointments.length).to.equal(2);
    });

    it('should finish all calls even if one fails', async () => {
      setFetchJSONFailure(global.fetch.onCall(2), { errors: [{}] });
      const eligibilityData = await getEligibilityData(
        {
          vistaId: '983',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
          legacyVAR: {
            directSchedulingSupported: true,
            requestSupported: true,
          },
        },
        { id: '502' },
        true,
      );

      expect(eligibilityData).to.have.all.keys(
        'directSupported',
        'directEnabled',
        'requestSupported',
        'clinics',
        'hasMatchingClinics',
        'pastAppointments',
        'direct',
        'request',
      );
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
          vistaId: '983',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
          legacyVAR: {
            directSchedulingSupported: true,
            requestSupported: true,
          },
        },
        { id: '502' },
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
          direct: {
            hasRequiredAppointmentHistory: false,
          },
          request: null,
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
          directEnabled: true,
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
