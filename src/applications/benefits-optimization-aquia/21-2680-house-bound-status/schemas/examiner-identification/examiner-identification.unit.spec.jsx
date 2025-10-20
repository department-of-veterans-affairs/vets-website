/**
 * @module tests/schemas/examiner-identification.unit.spec
 * @description Unit tests for examiner identification validation schemas
 */

import { expect } from 'chai';
import { examinerIdentificationSchema } from './examiner-identification';

describe('Examiner Identification Schemas', () => {
  describe('examinerIdentificationSchema', () => {
    it('should validate complete examiner identification', () => {
      const data = {
        examinerName: 'Dr. Beverly Crusher',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: 'Suite 100',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate without optional fields', () => {
      const data = {
        examinerName: 'Dr. Leonard McCoy',
        examinerTitle: 'do',
        examinerNPI: '9876543210',
        examinerPhone: '2125551234',
        facilityPracticeName: 'Starfleet Medical',
        examinerStreetAddress: '456 Health Blvd',
        examinerUnitNumber: '',
        examinerCity: 'Nar Shaddaa',
        examinerState: 'NY',
        examinerZip: '10001',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing required fields', () => {
      const data = {
        examinerUnitNumber: '',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
