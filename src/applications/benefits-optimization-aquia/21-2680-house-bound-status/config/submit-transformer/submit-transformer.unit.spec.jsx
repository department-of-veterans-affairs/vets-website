/**
 * @module tests/config/submit-transformer.unit.spec
 * @description Unit tests for submit transformer
 */

import { expect } from 'chai';
import { submitTransformer } from './submit-transformer';

describe('Submit Transformer', () => {
  const mockFormConfig = {};

  describe('Basic Functionality', () => {
    it('should export a function', () => {
      expect(submitTransformer).to.be.a('function');
    });

    it('should return an object', () => {
      const result = submitTransformer(mockFormConfig, {});
      expect(result).to.be.an('object');
    });

    it('should preserve original form data when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'spouse',
        },
        veteranIdentification: {
          veteranFullName: { first: 'John', last: 'Doe' },
          veteranDOB: '1980-01-01',
          veteranSSN: '123-45-6789',
        },
        claimantInformation: {
          claimantFullName: { first: 'Jane', last: 'Doe' },
          claimantDOB: '1982-05-15',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantInformation.claimantFullName.first).to.equal(
        'Jane',
      );
      expect(result.claimantInformation.claimantDOB).to.equal('1982-05-15');
    });
  });

  describe('Veteran is Claimant', () => {
    it('should copy veteran full name to claimant when claimantRelationship is veteran', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranFullName: {
            first: 'John',
            middle: 'Michael',
            last: 'Doe',
            suffix: 'Jr',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantInformation).to.exist;
      expect(result.claimantInformation.claimantFullName.first).to.equal(
        'John',
      );
      expect(result.claimantInformation.claimantFullName.middle).to.equal(
        'Michael',
      );
      expect(result.claimantInformation.claimantFullName.last).to.equal('Doe');
      expect(result.claimantInformation.claimantFullName.suffix).to.equal('Jr');
    });

    it('should copy veteran DOB to claimant when claimantRelationship is veteran', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranDOB: '1980-01-01',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantInformation.claimantDOB).to.equal('1980-01-01');
    });

    it('should copy veteran SSN to claimant when claimantRelationship is veteran', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranSSN: '123-45-6789',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantSSN).to.exist;
      expect(result.claimantSSN.claimantSSN).to.equal('123-45-6789');
    });

    it('should copy veteran address to claimant when claimantRelationship is veteran', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            street2: 'Apt 4B',
            street3: 'Building C',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
            country: 'USA',
            isMilitary: false,
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantAddress).to.exist;
      expect(result.claimantAddress.claimantAddress.street).to.equal(
        '123 Main St',
      );
      expect(result.claimantAddress.claimantAddress.street2).to.equal('Apt 4B');
      expect(result.claimantAddress.claimantAddress.street3).to.equal(
        'Building C',
      );
      expect(result.claimantAddress.claimantAddress.city).to.equal(
        'Springfield',
      );
      expect(result.claimantAddress.claimantAddress.state).to.equal('IL');
      expect(result.claimantAddress.claimantAddress.postalCode).to.equal(
        '62701',
      );
      expect(result.claimantAddress.claimantAddress.country).to.equal('USA');
      expect(result.claimantAddress.claimantAddress.isMilitary).to.equal(false);
    });

    it('should copy all veteran data to claimant in single transformation', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranFullName: { first: 'Alice', last: 'Smith' },
          veteranDOB: '1975-06-20',
          veteranSSN: '987-65-4321',
        },
        veteranAddress: {
          veteranAddress: {
            street: '456 Oak Ave',
            city: 'Portland',
            state: 'OR',
            postalCode: '97201',
            country: 'USA',
            isMilitary: false,
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      // Check all copied data
      expect(result.claimantInformation.claimantFullName.first).to.equal(
        'Alice',
      );
      expect(result.claimantInformation.claimantFullName.last).to.equal(
        'Smith',
      );
      expect(result.claimantInformation.claimantDOB).to.equal('1975-06-20');
      expect(result.claimantSSN.claimantSSN).to.equal('987-65-4321');
      expect(result.claimantAddress.claimantAddress.street).to.equal(
        '456 Oak Ave',
      );
      expect(result.claimantAddress.claimantAddress.city).to.equal('Portland');
    });
  });

  describe('Missing or Empty Data', () => {
    it('should handle missing veteran identification gracefully', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantInformation).to.exist;
      expect(result.claimantInformation.claimantFullName.first).to.equal('');
      expect(result.claimantInformation.claimantDOB).to.equal('');
    });

    it('should handle missing veteran address gracefully', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantAddress).to.exist;
      expect(result.claimantAddress.claimantAddress.street).to.equal('');
      expect(result.claimantAddress.claimantAddress.city).to.equal('');
    });

    it('should handle partial veteran name gracefully', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranFullName: {
            first: 'Bob',
            last: 'Jones',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantInformation.claimantFullName.first).to.equal('Bob');
      expect(result.claimantInformation.claimantFullName.middle).to.equal('');
      expect(result.claimantInformation.claimantFullName.last).to.equal(
        'Jones',
      );
      expect(result.claimantInformation.claimantFullName.suffix).to.equal('');
    });

    it('should handle partial veteran address gracefully', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranAddress: {
          veteranAddress: {
            street: '789 Pine St',
            city: 'Seattle',
            state: 'WA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantAddress.claimantAddress.street).to.equal(
        '789 Pine St',
      );
      expect(result.claimantAddress.claimantAddress.street2).to.equal('');
      expect(result.claimantAddress.claimantAddress.street3).to.equal('');
      expect(result.claimantAddress.claimantAddress.postalCode).to.equal('');
    });

    it('should default country to USA when not provided', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'Boston',
            state: 'MA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantAddress.claimantAddress.country).to.equal('USA');
    });

    it('should default isMilitary to false when not provided', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'Boston',
            state: 'MA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantAddress.claimantAddress.isMilitary).to.equal(false);
    });
  });

  describe('Preserve Other Form Data', () => {
    it('should preserve other form fields when transforming', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        benefitType: 'housebound',
        hospitalizationStatus: { isCurrentlyHospitalized: 'no' },
        veteranIdentification: {
          veteranFullName: { first: 'Test', last: 'User' },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.benefitType).to.equal('housebound');
      expect(result.hospitalizationStatus.isCurrentlyHospitalized).to.equal(
        'no',
      );
      expect(result.claimantRelationship.claimantRelationship).to.equal(
        'veteran',
      );
    });

    it('should not overwrite existing claimantContact when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranFullName: { first: 'Test', last: 'User' },
        },
        claimantContact: {
          claimantPhoneNumber: '555-1234',
          claimantEmail: 'test@example.com',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);
      expect(result.claimantContact.claimantPhoneNumber).to.equal('555-1234');
      expect(result.claimantContact.claimantEmail).to.equal('test@example.com');
    });
  });
});
