/**
 * @module tests/schemas/hospitalization.unit.spec
 * @description Unit tests for hospitalization validation schemas
 */

import { expect } from 'chai';
import {
  isCurrentlyHospitalizedSchema,
  admissionDateSchema,
  facilityNameSchema,
  facilityAddressSchema,
  hospitalizationSchema,
} from './hospitalization';

describe('Hospitalization Information Validation Schemas', () => {
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
      const result = facilityNameSchema.safeParse('Lothal Medical Center');
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

  describe('facilityAddressSchema', () => {
    it('should validate complete address', () => {
      const address = {
        street: '123 Hospital St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.true;
    });

    it('should validate address with street2 and street3', () => {
      const address = {
        street: '123 Hospital St',
        street2: 'Building A',
        street3: 'Floor 3',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.true;
    });

    it('should validate address with 9-digit ZIP', () => {
      const address = {
        street: '123 Hospital St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62701-1234',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.true;
    });

    it('should validate address with isMilitary flag', () => {
      const address = {
        street: 'APO',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '09012',
        isMilitary: true,
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.true;
    });

    it('should reject address without street', () => {
      const address = {
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject address without city', () => {
      const address = {
        street: '123 Hospital St',
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject address without state', () => {
      const address = {
        street: '123 Hospital St',
        city: 'Springfield',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject address without country', () => {
      const address = {
        street: '123 Hospital St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject address without postal code', () => {
      const address = {
        street: '123 Hospital St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject invalid postal code format', () => {
      const address = {
        street: '123 Hospital St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '123',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject street address over 50 characters', () => {
      const address = {
        street: 'A'.repeat(51),
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });

    it('should reject city over 50 characters', () => {
      const address = {
        street: '123 Hospital St',
        city: 'A'.repeat(51),
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      };
      const result = facilityAddressSchema.safeParse(address);
      expect(result.success).to.be.false;
    });
  });

  describe('hospitalizationSchema', () => {
    it('should validate not hospitalized with empty fields', () => {
      const data = {
        isCurrentlyHospitalized: 'no',
        admissionDate: '',
        facilityName: '',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate currently hospitalized with complete info', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate currently hospitalized with 9-digit ZIP', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102-1234',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject hospitalized without admission date', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
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
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without street address', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without city', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: '',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without state', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: '',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized without ZIP code', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing hospitalization status', () => {
      const data = {
        admissionDate: '',
        facilityName: '',
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with invalid admission date', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: 'invalid-date',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with invalid ZIP code', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '123',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with facility name over length', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'A'.repeat(101),
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with street address over length', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: 'A'.repeat(51),
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject hospitalized with city over length', () => {
      const data = {
        isCurrentlyHospitalized: 'yes',
        admissionDate: '2023-01-15',
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Capital Tower Way',
          city: 'A'.repeat(51),
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = hospitalizationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
