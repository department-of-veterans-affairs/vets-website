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

    it('should return a JSON string', () => {
      const result = submitTransformer(mockFormConfig, {});
      expect(result).to.be.a('string');
      expect(() => JSON.parse(result)).to.not.throw();
    });

    it('should wrap output in form object', () => {
      const result = submitTransformer(mockFormConfig, {});
      const parsed = JSON.parse(result);
      expect(parsed).to.have.property('form');
    });

    it('should have all required backend sections', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: { first: 'Anakin', last: 'Skywalker' },
          veteranDob: '1980-01-01',
          veteranSsn: '123456789',
        },
        claimantRelationship: {
          relationship: 'veteran',
        },
        benefitType: {
          benefitType: 'smc',
        },
        hospitalizationStatus: {
          isCurrentlyHospitalized: false,
        },
        statementOfTruthSignature: 'Anakin Skywalker',
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form).to.have.property('veteranInformation');
      expect(result.form).to.have.property('claimantInformation');
      expect(result.form).to.have.property('benefitInformation');
      expect(result.form).to.have.property('additionalInformation');
      expect(result.form).to.have.property('veteranSignature');
    });
  });

  describe('Veteran Information Section', () => {
    it('should transform veteran information correctly', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
            middle: 'L',
            last: 'Skywalker',
          },
          veteranDob: '1980-01-01',
          veteranSsn: '123456789',
          veteranVaFileNumber: '987654321',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.veteranInformation).to.deep.equal({
        fullName: {
          first: 'Anakin',
          middle: 'L',
          last: 'Skywalker',
        },
        ssn: '123456789',
        vaFileNumber: '987654321',
        dateOfBirth: '1980-01-01',
      });
    });

    it('should handle missing middle name', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
            last: 'Skywalker',
          },
          veteranDob: '1980-01-01',
          veteranSsn: '123456789',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.veteranInformation.fullName.middle).to.equal('');
    });
  });

  describe('Claimant Information - Veteran as Claimant', () => {
    it('should copy veteran data to claimant when veteran is claimant', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
            middle: 'L',
            last: 'Skywalker',
          },
          veteranDob: '1980-01-01',
          veteranSsn: '123456789',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Tatooine Ave',
            street2: 'Apt 4',
            city: 'Mos Eisley',
            state: 'CA',
            postalCode: '90210',
            country: 'USA',
          },
        },
        claimantRelationship: {
          relationship: 'veteran',
        },
        claimantContact: {
          claimantPhoneNumber: '5551234567',
          claimantEmail: 'anakin@jedi.org',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.claimantInformation.fullName).to.deep.equal({
        first: 'Anakin',
        middle: 'L',
        last: 'Skywalker',
      });
      expect(result.form.claimantInformation.dateOfBirth).to.equal(
        '1980-01-01',
      );
      expect(result.form.claimantInformation.ssn).to.equal('123456789');
      expect(result.form.claimantInformation.relationship).to.equal('self');
      expect(result.form.claimantInformation.address.street).to.equal(
        '123 Tatooine Ave',
      );
    });

    it('should strip dashes from SSN', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: { first: 'Anakin', last: 'Skywalker' },
          veteranDob: '1980-01-01',
          veteranSsn: '123-45-6789',
        },
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.veteranInformation.ssn).to.equal('123456789');
      expect(result.form.claimantInformation.ssn).to.equal('123456789');
    });

    it('should strip formatting from phone number', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        claimantContact: {
          claimantPhoneNumber: '(555) 123-4567',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.claimantInformation.phoneNumber).to.equal(
        '5551234567',
      );
    });
  });

  describe('Claimant Information - Non-Veteran Claimant', () => {
    it('should use claimant data when claimant is not veteran', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: { first: 'Anakin', last: 'Skywalker' },
          veteranDob: '1980-01-01',
          veteranSsn: '123456789',
        },
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            middle: 'A',
            last: 'Amidala',
          },
          claimantDob: '1982-05-15',
        },
        claimantSsn: {
          claimantSsn: '987654321',
        },
        claimantAddress: {
          claimantAddress: {
            street: '456 Naboo St',
            city: 'Theed',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
          },
        },
        claimantContact: {
          claimantPhoneNumber: '5559876543',
          claimantEmail: 'padme@naboo.org',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.claimantInformation.fullName).to.deep.equal({
        first: 'Padmé',
        middle: 'A',
        last: 'Amidala',
      });
      expect(result.form.claimantInformation.dateOfBirth).to.equal(
        '1982-05-15',
      );
      expect(result.form.claimantInformation.ssn).to.equal('987654321');
      expect(result.form.claimantInformation.relationship).to.equal('spouse');
      expect(result.form.claimantInformation.address.street).to.equal(
        '456 Naboo St',
      );
      expect(result.form.claimantInformation.phoneNumber).to.equal(
        '5559876543',
      );
      expect(result.form.claimantInformation.email).to.equal('padme@naboo.org');
    });
  });

  describe('Additional Information - Not Hospitalized', () => {
    it('should set currentlyHospitalized to false when not hospitalized', () => {
      const formData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: false,
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.additionalInformation.currentlyHospitalized).to.equal(
        false,
      );
      expect(result.form.additionalInformation).to.not.have.property(
        'admissionDate',
      );
      expect(result.form.additionalInformation).to.not.have.property(
        'hospitalName',
      );
      expect(result.form.additionalInformation).to.not.have.property(
        'hospitalAddress',
      );
    });
  });

  describe('Additional Information - Currently Hospitalized', () => {
    it('should include hospitalization details when currently hospitalized', () => {
      const formData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: true,
        },
        hospitalizationDate: {
          admissionDate: '2024-01-15',
        },
        hospitalizationFacility: {
          facilityName: 'VA Medical Center',
          facilityAddress: {
            street: '789 Hospital Rd',
            street2: 'Building A',
            city: 'Coruscant',
            state: 'TX',
            postalCode: '75001',
            country: 'USA',
          },
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.additionalInformation.currentlyHospitalized).to.equal(
        true,
      );
      expect(result.form.additionalInformation.admissionDate).to.equal(
        '2024-01-15',
      );
      expect(result.form.additionalInformation.hospitalName).to.equal(
        'VA Medical Center',
      );
      expect(result.form.additionalInformation.hospitalAddress).to.deep.equal({
        street: '789 Hospital Rd',
        street2: 'Building A',
        city: 'Coruscant',
        state: 'TX',
        postalCode: '75001',
        country: 'USA',
      });
    });
  });

  describe('Veteran Signature Section', () => {
    it('should include signature and current date', () => {
      const formData = {
        statementOfTruthSignature: 'Anakin L Skywalker',
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.veteranSignature.signature).to.equal(
        'Anakin L Skywalker',
      );
      expect(result.form.veteranSignature.date).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('View Fields Filtering', () => {
    it('should remove view: prefixed fields', () => {
      const formData = {
        'view:testField': 'should be removed',
        veteranInformation: {
          veteranFullName: { first: 'Anakin', last: 'Skywalker' },
          'view:someOtherField': 'also removed',
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      const resultString = JSON.stringify(result);
      expect(resultString).to.not.include('view:');
    });
  });

  describe('Default Values', () => {
    it('should handle missing optional fields gracefully', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: { first: 'Anakin' },
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.veteranInformation.fullName.middle).to.equal('');
      expect(result.form.veteranInformation.ssn).to.equal('');
      expect(result.form.veteranInformation.vaFileNumber).to.be.undefined;
    });
  });

  describe('Country Code Handling', () => {
    it('should use US as default country code', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'City',
            state: 'CA',
            postalCode: '90210',
          },
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.claimantInformation.address.country).to.equal('US');
    });

    it('should preserve USA country code', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'City',
            state: 'CA',
            postalCode: '90210',
            country: 'USA',
          },
        },
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));
      expect(result.form.claimantInformation.address.country).to.equal('USA');
    });
  });

  describe('Complete Form Submission', () => {
    it('should transform a complete form correctly', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
            middle: 'L',
            last: 'Skywalker',
          },
          veteranDob: '1980-01-01',
          veteranSsn: '123456789',
          veteranVaFileNumber: '987654321',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Tatooine Ave',
            city: 'Mos Eisley',
            state: 'CA',
            postalCode: '90210',
            country: 'USA',
          },
        },
        claimantRelationship: {
          relationship: 'veteran',
        },
        claimantContact: {
          claimantPhoneNumber: '5551234567',
          claimantEmail: 'anakin@jedi.org',
        },
        benefitType: {
          benefitType: 'smc',
        },
        hospitalizationStatus: {
          isCurrentlyHospitalized: true,
        },
        hospitalizationDate: {
          admissionDate: '2024-01-15',
        },
        hospitalizationFacility: {
          facilityName: 'VA Medical Center',
          facilityAddress: {
            street: '789 Hospital Rd',
            city: 'Coruscant',
            state: 'TX',
            postalCode: '75001',
            country: 'USA',
          },
        },
        statementOfTruthSignature: 'Anakin L Skywalker',
      };
      const result = JSON.parse(submitTransformer(mockFormConfig, formData));

      // Verify all sections exist
      expect(result.form).to.have.all.keys([
        'veteranInformation',
        'claimantInformation',
        'benefitInformation',
        'additionalInformation',
        'veteranSignature',
      ]);

      // Verify veteran information
      expect(result.form.veteranInformation.fullName.first).to.equal('Anakin');
      expect(result.form.veteranInformation.ssn).to.equal('123456789');

      // Verify claimant information (should use veteran data)
      expect(result.form.claimantInformation.fullName.first).to.equal('Anakin');
      expect(result.form.claimantInformation.relationship).to.equal('self');

      // Verify benefit information
      expect(result.form.benefitInformation.benefitSelection).to.equal('smc');

      // Verify additional information
      expect(result.form.additionalInformation.currentlyHospitalized).to.equal(
        true,
      );
      expect(result.form.additionalInformation.hospitalName).to.equal(
        'VA Medical Center',
      );

      // Verify signature
      expect(result.form.veteranSignature.signature).to.equal(
        'Anakin L Skywalker',
      );
    });
  });
});
