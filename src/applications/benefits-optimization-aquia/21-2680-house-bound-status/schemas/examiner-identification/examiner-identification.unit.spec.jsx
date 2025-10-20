/**
 * @module tests/schemas/examiner-identification.unit.spec
 * @description Unit tests for examiner identification validation schemas
 */

import { expect } from 'chai';
import {
  examinerNameSchema,
  examinerTitleSchema,
  examinerNPISchema,
  examinerPhoneSchema,
  facilityPracticeNameSchema,
  examinerStreetAddressSchema,
  examinerUnitNumberSchema,
  examinerCitySchema,
  examinerStateSchema,
  examinerZipSchema,
  examinerIdentificationSchema,
} from './examiner-identification';

describe('Examiner Identification Schemas', () => {
  describe('examinerNameSchema', () => {
    it('should validate valid examiner name', () => {
      const result = examinerNameSchema.safeParse('Dr. Beverly Crusher');
      expect(result.success).to.be.true;
    });

    it('should validate name at max length', () => {
      const result = examinerNameSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject empty name', () => {
      const result = examinerNameSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Examiner name is required',
      );
    });

    it('should reject name over 50 characters', () => {
      const result = examinerNameSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
    });
  });

  describe('examinerTitleSchema', () => {
    it('should validate md', () => {
      const result = examinerTitleSchema.safeParse('md');
      expect(result.success).to.be.true;
    });

    it('should validate do', () => {
      const result = examinerTitleSchema.safeParse('do');
      expect(result.success).to.be.true;
    });

    it('should validate pa', () => {
      const result = examinerTitleSchema.safeParse('pa');
      expect(result.success).to.be.true;
    });

    it('should validate aprn', () => {
      const result = examinerTitleSchema.safeParse('aprn');
      expect(result.success).to.be.true;
    });

    it('should validate np', () => {
      const result = examinerTitleSchema.safeParse('np');
      expect(result.success).to.be.true;
    });

    it('should validate cns', () => {
      const result = examinerTitleSchema.safeParse('cns');
      expect(result.success).to.be.true;
    });

    it('should reject invalid title', () => {
      const result = examinerTitleSchema.safeParse('phd');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('professional title');
    });

    it('should reject empty title', () => {
      const result = examinerTitleSchema.safeParse('');
      expect(result.success).to.be.false;
    });
  });

  describe('examinerNPISchema', () => {
    it('should validate 10-digit NPI', () => {
      const result = examinerNPISchema.safeParse('1234567890');
      expect(result.success).to.be.true;
    });

    it('should validate NPI with dashes', () => {
      const result = examinerNPISchema.safeParse('123-456-7890');
      expect(result.success).to.be.true;
    });

    it('should reject empty NPI', () => {
      const result = examinerNPISchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('NPI number is required');
    });

    it('should reject NPI with too few digits', () => {
      const result = examinerNPISchema.safeParse('123456789');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('exactly 10 digits');
    });

    it('should reject NPI with too many digits', () => {
      const result = examinerNPISchema.safeParse('12345678901');
      expect(result.success).to.be.false;
    });

    it('should reject NPI with letters', () => {
      const result = examinerNPISchema.safeParse('123456789A');
      expect(result.success).to.be.false;
    });
  });

  describe('examinerPhoneSchema', () => {
    it('should validate 10-digit phone', () => {
      const result = examinerPhoneSchema.safeParse('4155551234');
      expect(result.success).to.be.true;
    });

    it('should validate phone with dashes', () => {
      const result = examinerPhoneSchema.safeParse('415-555-1234');
      expect(result.success).to.be.true;
    });

    it('should validate phone with parentheses', () => {
      const result = examinerPhoneSchema.safeParse('(415) 555-1234');
      expect(result.success).to.be.true;
    });

    it('should reject empty phone', () => {
      const result = examinerPhoneSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Phone number is required',
      );
    });

    it('should reject phone with too few digits', () => {
      const result = examinerPhoneSchema.safeParse('123456');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('10-digit');
    });

    it('should reject phone with too many digits', () => {
      const result = examinerPhoneSchema.safeParse('12345678901');
      expect(result.success).to.be.false;
    });
  });

  describe('facilityPracticeNameSchema', () => {
    it('should validate valid facility name', () => {
      const result = facilityPracticeNameSchema.safeParse('Medical Center');
      expect(result.success).to.be.true;
    });

    it('should validate facility name at max length', () => {
      const result = facilityPracticeNameSchema.safeParse('A'.repeat(100));
      expect(result.success).to.be.true;
    });

    it('should reject empty facility name', () => {
      const result = facilityPracticeNameSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('required');
    });

    it('should reject facility name over 100 characters', () => {
      const result = facilityPracticeNameSchema.safeParse('A'.repeat(101));
      expect(result.success).to.be.false;
    });
  });

  describe('examinerStreetAddressSchema', () => {
    it('should validate valid street address', () => {
      const result = examinerStreetAddressSchema.safeParse('123 Medical Plaza');
      expect(result.success).to.be.true;
    });

    it('should validate street address at max length', () => {
      const result = examinerStreetAddressSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject empty street address', () => {
      const result = examinerStreetAddressSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Street address is required',
      );
    });

    it('should reject street address over 50 characters', () => {
      const result = examinerStreetAddressSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
    });
  });

  describe('examinerUnitNumberSchema', () => {
    it('should validate valid unit number', () => {
      const result = examinerUnitNumberSchema.safeParse('Suite 100');
      expect(result.success).to.be.true;
    });

    it('should validate empty unit number', () => {
      const result = examinerUnitNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined unit number', () => {
      const result = examinerUnitNumberSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate unit number at max length', () => {
      const result = examinerUnitNumberSchema.safeParse('A'.repeat(10));
      expect(result.success).to.be.true;
    });

    it('should reject unit number over 10 characters', () => {
      const result = examinerUnitNumberSchema.safeParse('A'.repeat(11));
      expect(result.success).to.be.false;
    });
  });

  describe('examinerCitySchema', () => {
    it('should validate valid city', () => {
      const result = examinerCitySchema.safeParse('Mos Eisley');
      expect(result.success).to.be.true;
    });

    it('should validate city at max length', () => {
      const result = examinerCitySchema.safeParse('A'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject empty city', () => {
      const result = examinerCitySchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('City is required');
    });

    it('should reject city over 30 characters', () => {
      const result = examinerCitySchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('examinerStateSchema', () => {
    it('should validate valid state code', () => {
      const result = examinerStateSchema.safeParse('CA');
      expect(result.success).to.be.true;
    });

    it('should validate another state code', () => {
      const result = examinerStateSchema.safeParse('NY');
      expect(result.success).to.be.true;
    });

    it('should reject empty state', () => {
      const result = examinerStateSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject state code with 1 character', () => {
      const result = examinerStateSchema.safeParse('C');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Please select a state');
    });

    it('should reject state code with 3 characters', () => {
      const result = examinerStateSchema.safeParse('CAL');
      expect(result.success).to.be.false;
    });
  });

  describe('examinerZipSchema', () => {
    it('should validate 5-digit ZIP code', () => {
      const result = examinerZipSchema.safeParse('94102');
      expect(result.success).to.be.true;
    });

    it('should validate 9-digit ZIP code', () => {
      const result = examinerZipSchema.safeParse('94102-1234');
      expect(result.success).to.be.true;
    });

    it('should reject empty ZIP code', () => {
      const result = examinerZipSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('ZIP code is required');
    });

    it('should reject invalid ZIP code', () => {
      const result = examinerZipSchema.safeParse('123');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('valid 5 or 9 digit');
    });

    it('should reject ZIP code with letters', () => {
      const result = examinerZipSchema.safeParse('ABCDE');
      expect(result.success).to.be.false;
    });
  });

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

    it('should validate all title types', () => {
      const titles = ['md', 'do', 'pa', 'aprn', 'np', 'cns'];

      titles.forEach(title => {
        const data = {
          examinerName: 'Dr. Test',
          examinerTitle: title,
          examinerNPI: '1234567890',
          examinerPhone: '4155551234',
          facilityPracticeName: 'Test Facility',
          examinerStreetAddress: '123 Main St',
          examinerUnitNumber: '',
          examinerCity: 'City',
          examinerState: 'CA',
          examinerZip: '94102',
        };
        const result = examinerIdentificationSchema.safeParse(data);
        expect(result.success).to.be.true;
      });
    });

    it('should reject missing examiner name', () => {
      const data = {
        examinerName: '',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid title', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'phd',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid NPI', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '123',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid phone', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '123',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing facility name', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: '',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing street address', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing city', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: '',
        examinerState: 'CA',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid state', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CAL',
        examinerZip: '94102',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid ZIP code', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '123',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should validate with 9-digit ZIP code', () => {
      const data = {
        examinerName: 'Dr. Test',
        examinerTitle: 'md',
        examinerNPI: '1234567890',
        examinerPhone: '4155551234',
        facilityPracticeName: 'Medical Center',
        examinerStreetAddress: '123 Medical Plaza',
        examinerUnitNumber: '',
        examinerCity: 'Mos Eisley',
        examinerState: 'CA',
        examinerZip: '94102-1234',
      };
      const result = examinerIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });
  });
});
