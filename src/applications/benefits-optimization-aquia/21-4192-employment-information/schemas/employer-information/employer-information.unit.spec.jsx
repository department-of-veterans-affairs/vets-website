/**
 * @module tests/schemas/employer-information.unit.spec
 * @description Unit tests for employer information validation schemas
 */

import { expect } from 'chai';
import {
  employerAddressSchema,
  employerInformationSchema,
  employerNameSchema,
} from './employer-information';

describe('Employer Information Schemas', () => {
  describe('employerNameSchema', () => {
    describe('Valid Employer Names', () => {
      it('should validate employer name', () => {
        const result = employerNameSchema.safeParse('Bounty Hunters Guild');
        expect(result.success).to.be.true;
      });

      it('should validate name with special characters', () => {
        const result = employerNameSchema.safeParse('Slave I');
        expect(result.success).to.be.true;
      });

      it('should validate name with numbers', () => {
        const result = employerNameSchema.safeParse('Nar Shaddaa Sector 11');
        expect(result.success).to.be.true;
      });

      it('should validate single character name', () => {
        const result = employerNameSchema.safeParse('Q');
        expect(result.success).to.be.true;
      });

      it('should validate 100 character name', () => {
        const result = employerNameSchema.safeParse('A'.repeat(100));
        expect(result.success).to.be.true;
      });

      it('should validate various organizations', () => {
        const employers = [
          'Kamino Cloning Facility',
          'Mos Eisley Cantina',
          'Mandalorian Training Corps',
          'Hutt Cartel',
          'Crimson Dawn',
          'Guild Council',
        ];

        employers.forEach(name => {
          const result = employerNameSchema.safeParse(name);
          expect(result.success).to.be.true;
        });
      });
    });

    describe('Invalid Employer Names', () => {
      it('should reject empty string', () => {
        const result = employerNameSchema.safeParse('');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('required');
        }
      });

      it('should reject names over 100 characters', () => {
        const result = employerNameSchema.safeParse('A'.repeat(101));
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include(
            'less than 100 characters',
          );
        }
      });
    });
  });

  describe('employerAddressSchema', () => {
    describe('Valid Addresses', () => {
      it('should validate complete address', () => {
        const result = employerAddressSchema.safeParse({
          street: 'Guild Headquarters',
          street2: 'Building One',
          street3: 'Floor 5',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
          isMilitary: false,
        });
        expect(result.success).to.be.true;
      });

      it('should validate address without optional fields', () => {
        const result = employerAddressSchema.safeParse({
          street: 'Guild Headquarters',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        });
        expect(result.success).to.be.true;
      });

      it('should validate address with 5-digit ZIP', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        });
        expect(result.success).to.be.true;
      });

      it('should validate address with 9-digit ZIP', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '94102-1234',
        });
        expect(result.success).to.be.true;
      });

      it('should default country to USA', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
        });
        if (result.success) {
          expect(result.data.country).to.equal('USA');
        }
      });

      it('should validate various locations', () => {
        const addresses = [
          {
            street: 'Mount Seleya',
            city: 'ShiKahr',
            state: 'CA',
            postalCode: '91234',
          },
          {
            street: 'First City',
            city: "Qo'noS",
            state: 'NY',
            postalCode: '10001',
          },
          {
            street: 'Outer Rim Sector',
            city: 'Bajor',
            state: 'TX',
            postalCode: '75001',
          },
        ];

        addresses.forEach(addr => {
          const result = employerAddressSchema.safeParse(addr);
          expect(result.success).to.be.true;
        });
      });
    });

    describe('Invalid Addresses', () => {
      it('should reject missing street', () => {
        const result = employerAddressSchema.safeParse({
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.false;
      });

      it('should reject empty street', () => {
        const result = employerAddressSchema.safeParse({
          street: '',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing city', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.false;
      });

      it('should reject empty city', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: '',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing state', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          postalCode: '94102',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing postal code', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid postal code format', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '1234',
        });
        expect(result.success).to.be.false;
      });

      it('should reject postal code with letters', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: 'ABCDE',
        });
        expect(result.success).to.be.false;
      });
    });

    describe('Optional Fields', () => {
      it('should accept undefined street2', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.true;
      });

      it('should accept empty street2', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          street2: '',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.true;
      });

      it('should accept undefined isMilitary', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
        });
        expect(result.success).to.be.true;
      });

      it('should accept isMilitary as true', () => {
        const result = employerAddressSchema.safeParse({
          street: '123 Main St',
          city: 'Mos Eisley',
          state: 'CA',
          postalCode: '94102',
          isMilitary: true,
        });
        expect(result.success).to.be.true;
      });
    });
  });

  describe('employerInformationSchema', () => {
    describe('Complete Employer Information', () => {
      it('should validate complete employer information', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Guild Headquarters',
            street2: 'Building One',
            city: 'Mos Eisley',
            state: 'CA',
            country: 'USA',
            postalCode: '94102',
          },
        });
        expect(result.success).to.be.true;
      });

      it('should validate Slave I', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Slave I',
          employerAddress: {
            street: 'Nar Shaddaa Sector 11',
            city: 'Nar Shaddaa',
            state: 'CA',
            postalCode: '90210',
          },
        });
        expect(result.success).to.be.true;
      });

      it('should validate Mos Eisley Cantina', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Mos Eisley Cantina',
          employerAddress: {
            street: 'Outer Rim Sector',
            city: 'Bajor',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
        });
        expect(result.success).to.be.true;
      });

      it('should validate Mandalorian Training Corps', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Mandalorian Training Corps',
          employerAddress: {
            street: 'Mount Seleya',
            city: 'ShiKahr',
            state: 'CA',
            postalCode: '91234',
          },
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Employer Information', () => {
      it('should reject missing employerName', () => {
        const result = employerInformationSchema.safeParse({
          employerAddress: {
            street: '123 Main St',
            city: 'Mos Eisley',
            state: 'CA',
            postalCode: '94102',
          },
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing employerAddress', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Bounty Hunters Guild',
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid address', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: '123 Main St',
          },
        });
        expect(result.success).to.be.false;
      });

      it('should reject empty object', () => {
        const result = employerInformationSchema.safeParse({});
        expect(result.success).to.be.false;
      });
    });

    describe('Edge Cases', () => {
      it('should handle minimum valid data', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Q',
          employerAddress: {
            street: 'A',
            city: 'B',
            state: 'CA',
            postalCode: '12345',
          },
        });
        expect(result.success).to.be.true;
      });

      it('should handle maximum length employer name', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'A'.repeat(100),
          employerAddress: {
            street: '123 Main St',
            city: 'Mos Eisley',
            state: 'CA',
            postalCode: '94102',
          },
        });
        expect(result.success).to.be.true;
      });

      it('should handle all address lines filled', () => {
        const result = employerInformationSchema.safeParse({
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Building 1',
            street2: 'Suite 100',
            street3: 'Floor 5',
            city: 'Mos Eisley',
            state: 'CA',
            country: 'USA',
            postalCode: '94102-1234',
            isMilitary: true,
          },
        });
        expect(result.success).to.be.true;
      });
    });
  });
});
