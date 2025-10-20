/**
 * @module tests/schemas/hospitalization.unit.spec
 * @description Unit tests for hospitalization validation schemas
 */

import { expect } from 'chai';
import { hospitalizationSchema } from './hospitalization';

describe('Hospitalization Schemas', () => {
  describe('hospitalizationSchema', () => {
    it('should validate not hospitalized', () => {
      const data = {
        isCurrentlyHospitalized: 'no',
        admissionDate: '',
        facilityName: '',
        facilityStreetAddress: '',
        facilityCity: '',
        facilityState: '',
        facilityZip: '',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate currently hospitalized', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing hospitalization status', () => {
      const data = {};
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
