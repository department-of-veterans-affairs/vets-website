import { expect } from 'chai';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  getApiBasePath,
  getRefillMethod,
  getPrescriptionByIdPath,
} from '../../api/prescriptionsApi';

describe('prescriptionsApi', () => {
  describe('getPrescriptionByIdPath', () => {
    it('should return path without station number when stationNumber is not provided', () => {
      const result = getPrescriptionByIdPath({ prescriptionId: '123' });
      expect(result).to.deep.equal({ path: '/prescriptions/123' });
    });

    it('should return path with station number when stationNumber is provided', () => {
      const result = getPrescriptionByIdPath({
        prescriptionId: '123',
        stationNumber: '456',
      });
      expect(result).to.deep.equal({
        path: '/prescriptions/123?station_number=456',
      });
    });
  });

  describe('getApiBasePath', () => {
    it('should return v2 path when Cerner pilot flag is enabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: false,
        },
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v2`);
    });

    it('should return v1 path when Cerner pilot flag is disabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          loading: false,
        },
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when feature toggles are loading', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: true,
        },
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when featureToggles object is missing', () => {
      const mockState = {};

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when featureToggles is null', () => {
      const mockState = {
        featureToggles: null,
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });
  });

  describe('getRefillMethod', () => {
    it('should return POST when Cerner pilot flag is enabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: false,
        },
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('POST');
    });

    it('should return PATCH when Cerner pilot flag is disabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          loading: false,
        },
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when feature toggles are loading', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: true,
        },
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when featureToggles is missing', () => {
      const mockState = {};

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when featureToggles is null', () => {
      const mockState = {
        featureToggles: null,
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });
  });
});
