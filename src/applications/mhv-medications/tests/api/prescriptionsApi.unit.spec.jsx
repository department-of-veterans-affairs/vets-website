import { expect } from 'chai';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import { getApiBasePath, getRefillMethod } from '../../api/prescriptionsApi';

describe('prescriptionsApi', () => {
  describe('getApiBasePath', () => {
    it('should return v2 path when isAcceleratingMedications is true', () => {
      const result = getApiBasePath(true);

      expect(result).to.equal(`${environment.API_URL}/my_health/v2`);
    });

    it('should return v1 path when isAcceleratingMedications is false', () => {
      const result = getApiBasePath(false);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when isAcceleratingMedications is missing', () => {
      const result = getApiBasePath();

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when isAcceleratingMedications is null', () => {
      const result = getApiBasePath(null);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });
  });

  describe('getRefillMethod', () => {
    it('should return POST when isAcceleratingMedications is true', () => {
      const result = getRefillMethod(true);

      expect(result).to.equal('POST');
    });

    it('should return PATCH when isAcceleratingMedications is false', () => {
      const result = getRefillMethod(false);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when isAcceleratingMedications is missing', () => {
      const result = getRefillMethod();

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when isAcceleratingMedications is null', () => {
      const result = getRefillMethod(null);

      expect(result).to.equal('PATCH');
    });
  });
});
