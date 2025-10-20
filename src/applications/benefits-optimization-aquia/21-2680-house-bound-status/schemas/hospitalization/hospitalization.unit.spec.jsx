/**
 * @module tests/schemas/hospitalization.unit.spec
 * @description Unit tests for hospitalization validation schemas
 */

import { expect } from 'chai';
import {
  isCurrentlyHospitalizedSchema,
  admissionDateSchema,
  facilityNameSchema,
  facilityStreetAddressSchema,
  facilityCitySchema,
  facilityStateSchema,
  facilityZipSchema,
  hospitalizationSchema,
} from './hospitalization';

describe('Hospitalization Schemas', () => {
  describe('isCurrentlyHospitalizedSchema', () => {
    it('should validate yes', () => {
      const result = isCurrentlyHospitalizedSchema.safeParse('yes');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('yes');
    });

    it('should validate no', () => {
      const result = isCurrentlyHospitalizedSchema.safeParse('no');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('no');
    });

    it('should reject invalid value', () => {
      const result = isCurrentlyHospitalizedSchema.safeParse('maybe');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'hospitalization status',
      );
    });

    it('should reject empty value', () => {
      const result = isCurrentlyHospitalizedSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject null value', () => {
      const result = isCurrentlyHospitalizedSchema.safeParse(null);
      expect(result.success).to.be.false;
    });
  });

  describe('admissionDateSchema', () => {
    it('should validate valid date', () => {
      const result = admissionDateSchema.safeParse('2023-01-15');
      expect(result.success).to.be.true;
    });

    it('should validate empty date', () => {
      const result = admissionDateSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined date', () => {
      const result = admissionDateSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate date in past', () => {
      const result = admissionDateSchema.safeParse('2020-01-01');
      expect(result.success).to.be.true;
    });

    it('should validate recent date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = admissionDateSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should reject invalid date format', () => {
      const result = admissionDateSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('valid date');
    });

    it('should reject invalid date string', () => {
      const result = admissionDateSchema.safeParse('13/45/2023');
      expect(result.success).to.be.false;
    });
  });

  describe('facilityNameSchema', () => {
    it('should validate valid facility name', () => {
      const result = facilityNameSchema.safeParse('VA Medical Center');
      expect(result.success).to.be.true;
    });

    it('should validate empty facility name', () => {
      const result = facilityNameSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined facility name', () => {
      const result = facilityNameSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate facility name at max length', () => {
      const result = facilityNameSchema.safeParse('A'.repeat(100));
      expect(result.success).to.be.true;
    });

    it('should reject facility name over 100 characters', () => {
      const result = facilityNameSchema.safeParse('A'.repeat(101));
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'less than 100 characters',
      );
    });
  });

  describe('facilityStreetAddressSchema', () => {
    it('should validate valid street address', () => {
      const result = facilityStreetAddressSchema.safeParse('123 Hospital St');
      expect(result.success).to.be.true;
    });

    it('should validate empty street address', () => {
      const result = facilityStreetAddressSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined street address', () => {
      const result = facilityStreetAddressSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate street address at max length', () => {
      const result = facilityStreetAddressSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject street address over 50 characters', () => {
      const result = facilityStreetAddressSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
    });
  });

  describe('facilityCitySchema', () => {
    it('should validate valid city', () => {
      const result = facilityCitySchema.safeParse('Mos Eisley');
      expect(result.success).to.be.true;
    });

    it('should validate empty city', () => {
      const result = facilityCitySchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined city', () => {
      const result = facilityCitySchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate city at max length', () => {
      const result = facilityCitySchema.safeParse('A'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject city over 30 characters', () => {
      const result = facilityCitySchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('facilityStateSchema', () => {
    it('should validate valid state code', () => {
      const result = facilityStateSchema.safeParse('CA');
      expect(result.success).to.be.true;
    });

    it('should validate empty state', () => {
      const result = facilityStateSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined state', () => {
      const result = facilityStateSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate another state code', () => {
      const result = facilityStateSchema.safeParse('NY');
      expect(result.success).to.be.true;
    });
  });

  describe('facilityZipSchema', () => {
    it('should validate 5-digit ZIP code', () => {
      const result = facilityZipSchema.safeParse('94102');
      expect(result.success).to.be.true;
    });

    it('should validate 9-digit ZIP code', () => {
      const result = facilityZipSchema.safeParse('94102-1234');
      expect(result.success).to.be.true;
    });

    it('should validate empty ZIP code', () => {
      const result = facilityZipSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined ZIP code', () => {
      const result = facilityZipSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject invalid ZIP code', () => {
      const result = facilityZipSchema.safeParse('123');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('valid 5 or 9 digit');
    });

    it('should reject ZIP code with letters', () => {
      const result = facilityZipSchema.safeParse('ABCDE');
      expect(result.success).to.be.false;
    });
  });

  describe('hospitalizationSchema', () => {
    it('should validate not hospitalized with empty fields', () => {
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

    it('should validate currently hospitalized with complete info', () => {
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

    it('should validate currently hospitalized with 9-digit ZIP', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102-1234',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject hospitalized without admission date', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'complete facility information',
      );
    });

    it('should reject hospitalized without facility name', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: '',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without street address', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without city', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: '',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without state', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: '',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without ZIP code', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing hospitalization status', () => {
      const data = {
        admissionDate: '',
        facilityName: '',
        facilityStreetAddress: '',
        facilityCity: '',
        facilityState: '',
        facilityZip: '',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with invalid admission date', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: 'invalid-date',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with invalid ZIP code', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '123',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with facility name over length', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'A'.repeat(101),
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with street address over length', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: 'A'.repeat(51),
        facilityCity: 'Mos Eisley',
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with city over length', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'VA Medical Center',
        facilityStreetAddress: '123 Hospital St',
        facilityCity: 'A'.repeat(31),
        facilityState: 'CA',
        facilityZip: '94102',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
