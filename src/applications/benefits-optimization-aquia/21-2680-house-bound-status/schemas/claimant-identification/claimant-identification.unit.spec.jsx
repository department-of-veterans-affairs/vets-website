/**
 * @module tests/schemas/claimant-identification.unit.spec
 * @description Unit tests for claimant identification validation schemas
 */

import { expect } from 'chai';
import { claimantIdentificationSchema } from './claimant-identification';

describe('Claimant Identification Schemas', () => {
  describe('claimantIdentificationSchema', () => {
    it('should validate complete claimant identification', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
        claimantRelationshipOther: '',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate with other relationship', () => {
      const data = {
        claimantFirstName: 'Jango',
        claimantMiddleName: '',
        claimantLastName: 'Fett',
        claimantStreetAddress: '456 Oak Ave',
        claimantUnitNumber: 'Apt 2',
        claimantCity: 'Nar Shaddaa',
        claimantState: 'NY',
        claimantZip: '10001',
        claimantPhone: '2125551234',
        claimantRelationship: 'other',
        claimantRelationshipOther: 'Caregiver',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing required fields', () => {
      const data = {
        claimantMiddleName: '',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
