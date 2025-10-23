import { expect } from 'chai';
import {
  addressSchema,
  citySchema,
  countryCodeSchema,
  internationalAddressSchema,
  militaryAddressSchema,
  postalCodeSchema,
  stateCodeSchema,
  streetAddressSchema,
} from './address';

describe('Address Schemas - Location validation', () => {
  describe('streetAddressSchema', () => {
    it('validates street addresses', () => {
      const validAddresses = [
        '123 Main St',
        '456 Oak Avenue',
        '789 First Street, Apt 5',
        '1000 Pennsylvania Ave NW',
      ];

      validAddresses.forEach(address => {
        const result = streetAddressSchema.safeParse(address);
        expect(result.success).to.be.true;
      });
    });

    it('rejects empty addresses', () => {
      const result = streetAddressSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('reject addresses longer than 100 characters', () => {
      const longAddress = 'a'.repeat(101);
      const result = streetAddressSchema.safeParse(longAddress);
      expect(result.success).to.be.false;
    });

    it('trim whitespace', () => {
      const result = streetAddressSchema.safeParse('  123 Main St  ');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('123 Main St');
    });
  });

  describe('citySchema', () => {
    it('validate valid city names', () => {
      const validCities = [
        'New York',
        'Los Angeles',
        'San Francisco',
        "O'Fallon",
        'Saint-Louis',
      ];

      validCities.forEach(city => {
        const result = citySchema.safeParse(city);
        expect(result.success).to.be.true;
      });
    });

    it('reject empty city names', () => {
      const result = citySchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('reject cities longer than 50 characters', () => {
      const longCity = 'a'.repeat(51);
      const result = citySchema.safeParse(longCity);
      expect(result.success).to.be.false;
    });
  });

  describe('stateCodeSchema', () => {
    it('validate valid US state codes', () => {
      const validStates = ['CA', 'NY', 'TX', 'FL', 'IL'];

      validStates.forEach(state => {
        const result = stateCodeSchema.safeParse(state);
        expect(result.success).to.be.true;
      });
    });

    it('convert lowercase to uppercase', () => {
      const result = stateCodeSchema.safeParse('ca');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('CA');
    });

    it('reject invalid state codes', () => {
      const invalidStates = ['ZZ', 'XX', '12', 'CAL', 'C'];

      invalidStates.forEach(state => {
        const result = stateCodeSchema.safeParse(state);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('postalCodeSchema', () => {
    it('validate valid US postal codes', () => {
      const validCodes = ['12345', '12345-6789'];

      validCodes.forEach(code => {
        const result = postalCodeSchema.safeParse(code);
        expect(result.success).to.be.true;
      });
    });

    it('validate valid Canadian postal codes', () => {
      const validCodes = ['K1A 0B1', 'M5H 2N2'];

      validCodes.forEach(code => {
        const result = postalCodeSchema.safeParse(code);
        expect(result.success).to.be.true;
      });
    });

    it('validate military ZIP codes', () => {
      const validMilitaryCodes = ['09001', '34001', '96201'];

      validMilitaryCodes.forEach(code => {
        const result = postalCodeSchema.safeParse(code);
        expect(result.success).to.be.true;
      });
    });

    it('reject invalid postal codes for country', () => {
      const result1 = postalCodeSchema.safeParse({
        country: 'USA',
        code: 'K1A 0B1',
      });
      expect(result1.success).to.be.false;

      const result2 = postalCodeSchema.safeParse({
        country: 'CAN',
        code: '12345',
      });
      expect(result2.success).to.be.false;
    });
  });

  describe('countryCodeSchema', () => {
    it('validate valid country codes', () => {
      const validCodes = ['USA', 'CAN', 'MEX'];

      validCodes.forEach(code => {
        const result = countryCodeSchema.safeParse(code);
        expect(result.success).to.be.true;
      });
    });

    it('default to USA', () => {
      const result = countryCodeSchema.safeParse(undefined);
      expect(result.success).to.be.true;
      expect(result.data).to.equal('USA');
    });

    it('reject invalid country codes', () => {
      const invalidCodes = ['United States', 'CANADA', 'U', 'ABCD', '1234'];

      invalidCodes.forEach(code => {
        const result = countryCodeSchema.safeParse(code);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('addressSchema', () => {
    it('validate complete US address', () => {
      const validAddress = {
        street: '123 Main St',
        street2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      };

      const result = addressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('validate address without optional street2', () => {
      const validAddress = {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
      };

      const result = addressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('require all required fields', () => {
      const invalidAddresses = [
        { city: 'New York', state: 'NY', postalCode: '10001' }, // missing street
        { street: '123 Main', state: 'NY', postalCode: '10001' }, // missing city
        { street: '123 Main', city: 'New York', postalCode: '10001' }, // missing state
        { street: '123 Main', city: 'New York', state: 'NY' }, // missing postal
      ];

      invalidAddresses.forEach(address => {
        const result = addressSchema.safeParse(address);
        expect(result.success).to.be.false;
      });
    });

    it('require country field', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      };

      const result = addressSchema.safeParse(address);
      expect(result.success).to.be.true;
      expect(result.data.country).to.equal('USA');
    });

    it('validate postal code based on country', () => {
      const usAddress = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      };

      const result1 = addressSchema.safeParse(usAddress);
      expect(result1.success).to.be.true;

      // Try Canadian postal code with USA country
      const invalidAddress = {
        ...usAddress,
        postalCode: 'K1A 0B1',
      };

      const result2 = addressSchema.safeParse(invalidAddress);
      expect(result2.success).to.be.false;
    });
  });

  describe('internationalAddressSchema', () => {
    it('validate Canadian address', () => {
      const canadianAddress = {
        street: '123 Queen St',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5H 2N2',
        country: 'CAN',
      };

      const result = internationalAddressSchema.safeParse(canadianAddress);
      expect(result.success).to.be.true;
    });

    it('validate Mexican address', () => {
      const mexicanAddress = {
        street: '123 Reforma Ave',
        city: 'Mexico City',
        state: 'MX',
        postalCode: '01234',
        country: 'MEX',
      };

      const result = internationalAddressSchema.safeParse(mexicanAddress);
      expect(result.success).to.be.true;
    });

    it('allow various international postal code formats', () => {
      const addresses = [
        {
          street: '123 Test St',
          city: 'Test City',
          state: 'TC',
          postalCode: 'ABC 123',
          country: 'MEX',
        },
        {
          street: '456 Test Ave',
          city: 'Test Town',
          state: 'TT',
          postalCode: '12345-678',
          country: 'MEX',
        },
      ];

      addresses.forEach(address => {
        const result = internationalAddressSchema.safeParse(address);
        expect(result.success).to.be.true;
      });
    });
  });

  describe('militaryAddressSchema', () => {
    it('validate APO address', () => {
      const apoAddress = {
        street: 'PSC 1234 Box 5678',
        city: 'APO',
        state: 'AE',
        postalCode: '09001',
        country: 'USA',
      };

      const result = militaryAddressSchema.safeParse(apoAddress);
      expect(result.success).to.be.true;
    });

    it('validate FPO address', () => {
      const fpoAddress = {
        street: 'Unit 1234 Box 5678',
        city: 'FPO',
        state: 'AP',
        postalCode: '96201',
        country: 'USA',
      };

      const result = militaryAddressSchema.safeParse(fpoAddress);
      expect(result.success).to.be.true;
    });

    it('validate DPO address', () => {
      const dpoAddress = {
        street: 'CMR 1234 Box 5678',
        city: 'DPO',
        state: 'AA',
        postalCode: '34001',
        country: 'USA',
      };

      const result = militaryAddressSchema.safeParse(dpoAddress);
      expect(result.success).to.be.true;
    });

    it('require military state codes', () => {
      const validMilitaryStates = ['AE', 'AP', 'AA'];

      validMilitaryStates.forEach(state => {
        const address = {
          street: 'Unit 1234',
          city: 'APO',
          state,
          postalCode: '09001',
          country: 'USA',
        };

        const result = militaryAddressSchema.safeParse(address);
        expect(result.success).to.be.true;
      });
    });

    it('reject non-military cities for military addresses', () => {
      const invalidAddress = {
        street: 'Unit 1234',
        city: 'New York',
        state: 'AE',
        postalCode: '09001',
        country: 'USA',
      };

      const result = militaryAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });
  });
});
