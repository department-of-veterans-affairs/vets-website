/**
 * @module tests/config/submit-transformer.unit.spec
 * @description Unit tests for submit transformer that maps form data to Simple Forms API payload
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

    it('should return API payload with snake_case field names', () => {
      const formData = {
        veteranIdentification: {
          veteranFullName: { first: 'John', last: 'Doe' },
          veteranDOB: '1980-01-01',
          veteranSSN: '123-45-6789',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      // Check for snake_case API fields (not camelCase frontend fields)
      expect(result).to.have.property('form_number');
      expect(result).to.have.property('veteran_full_name');
      expect(result).to.have.property('veteran_id');
      expect(result).to.have.property('veteran_date_of_birth');
      expect(result).to.not.have.property('veteranIdentification');
    });

    it('should include required form metadata fields', () => {
      const formData = {};
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.form_number).to.equal('21-2680');
      expect(result.form_name).to.include('Housebound');
      expect(result.statement_of_truth_certified).to.be.true;
    });
  });

  describe('Veteran Information Transformation', () => {
    it('should map veteran full name to API structure', () => {
      const formData = {
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

      expect(result.veteran_full_name.first).to.equal('John');
      expect(result.veteran_full_name.middle).to.equal('Michael');
      expect(result.veteran_full_name.last).to.equal('Doe');
      expect(result.veteran_full_name.suffix).to.equal('Jr');
    });

    it('should format veteran SSN without dashes', () => {
      const formData = {
        veteranIdentification: {
          veteranSSN: '123-45-6789',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_id.ssn).to.equal('123456789');
    });

    it('should format veteran date of birth', () => {
      const formData = {
        veteranIdentification: {
          veteranDOB: '1980-01-01',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_date_of_birth).to.equal('1980-01-01');
    });

    it('should map veteran address with snake_case field names', () => {
      const formData = {
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

      expect(result.veteran_mailing_address.street).to.equal('123 Main St');
      expect(result.veteran_mailing_address.street2).to.equal('Apt 4B');
      expect(result.veteran_mailing_address.street3).to.equal('Building C');
      expect(result.veteran_mailing_address.city).to.equal('Springfield');
      expect(result.veteran_mailing_address.state).to.equal('IL');
      expect(result.veteran_mailing_address.postal_code).to.equal('62701');
      expect(result.veteran_mailing_address.country).to.equal('USA');
      expect(result.veteran_mailing_address.is_military).to.equal(false);
    });

    it('should default country to USA when not provided', () => {
      const formData = {
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'Boston',
            state: 'MA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_mailing_address.country).to.equal('USA');
    });

    it('should default isMilitary to false when not provided', () => {
      const formData = {
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'Boston',
            state: 'MA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_mailing_address.is_military).to.equal(false);
    });
  });

  describe('Claimant Information - Separate Claimant', () => {
    it('should map claimant information when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            middle: 'Anne',
            last: 'Doe',
            suffix: '',
          },
          claimantDOB: '1982-05-15',
        },
        claimantSSN: {
          claimantSSN: '987-65-4321',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.claimant_relationship).to.equal('spouse');
      expect(result.claimant_full_name.first).to.equal('Jane');
      expect(result.claimant_full_name.middle).to.equal('Anne');
      expect(result.claimant_full_name.last).to.equal('Doe');
      expect(result.claimant_date_of_birth).to.equal('1982-05-15');
      expect(result.claimant_ssn).to.equal('987654321');
    });

    it('should map claimant address', () => {
      const formData = {
        claimantAddress: {
          claimantAddress: {
            street: '789 Medical Bay Road',
            street2: 'Apt 3B',
            city: 'San Diego',
            state: 'CA',
            postalCode: '92101',
            country: 'USA',
            isMilitary: false,
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.claimant_mailing_address.street).to.equal(
        '789 Medical Bay Road',
      );
      expect(result.claimant_mailing_address.street2).to.equal('Apt 3B');
      expect(result.claimant_mailing_address.city).to.equal('San Diego');
      expect(result.claimant_mailing_address.state).to.equal('CA');
      expect(result.claimant_mailing_address.postal_code).to.equal('92101');
    });

    it('should map claimant contact information', () => {
      const formData = {
        claimantContact: {
          claimantPhoneNumber: '6195551234',
          claimantMobilePhone: '6195555678',
          claimantEmail: 'test@example.com',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.phone_number).to.equal('6195551234');
      expect(result.mobile_phone_number).to.equal('6195555678');
      expect(result.email).to.equal('test@example.com');
    });
  });

  describe('Veteran is Claimant', () => {
    it('should use veteran data for claimant fields when claimant is veteran', () => {
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
          veteranDOB: '1980-01-01',
          veteranSSN: '123-45-6789',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
            country: 'USA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      // Claimant fields should match veteran fields
      expect(result.claimant_relationship).to.equal('veteran');
      expect(result.claimant_full_name.first).to.equal('John');
      expect(result.claimant_full_name.middle).to.equal('Michael');
      expect(result.claimant_full_name.last).to.equal('Doe');
      expect(result.claimant_full_name.suffix).to.equal('Jr');
      expect(result.claimant_date_of_birth).to.equal('1980-01-01');
      expect(result.claimant_ssn).to.equal('123456789');
      expect(result.claimant_mailing_address.street).to.equal('123 Main St');
      expect(result.claimant_mailing_address.city).to.equal('Springfield');
    });

    it('should handle missing veteran data gracefully when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.claimant_full_name.first).to.equal('');
      expect(result.claimant_full_name.last).to.equal('');
      expect(result.claimant_date_of_birth).to.equal('');
      expect(result.claimant_ssn).to.equal('');
    });
  });

  describe('Benefit Type', () => {
    it('should map benefit type field', () => {
      const formData = {
        benefitType: {
          benefitType: 'SMC',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.benefit_type).to.equal('SMC');
    });
  });

  describe('Hospitalization - Not Hospitalized', () => {
    it('should set currently_hospitalized to false when status is no', () => {
      const formData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'no',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.currently_hospitalized).to.be.false;
    });

    it('should not include hospitalization details when not currently hospitalized', () => {
      const formData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'no',
        },
        hospitalizationDate: {
          admissionDate: '2024-01-15',
        },
        hospitalizationFacility: {
          facilityName: 'VA Medical Center',
          facilityAddress: {
            street: '123 Hospital St',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.currently_hospitalized).to.be.false;
      expect(result).to.not.have.property('hospitalization_admission_date');
      expect(result).to.not.have.property('hospitalization_facility_name');
      expect(result).to.not.have.property('hospitalization_facility_address');
    });
  });

  describe('Hospitalization - Currently Hospitalized', () => {
    it('should set currently_hospitalized to true when status is yes', () => {
      const formData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'yes',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.currently_hospitalized).to.be.true;
    });

    it('should include hospitalization details when currently hospitalized', () => {
      const formData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'yes',
        },
        hospitalizationDate: {
          admissionDate: '2024-01-15',
        },
        hospitalizationFacility: {
          facilityName: 'Starfleet Medical Center',
          facilityAddress: {
            street: '1 Starfleet Medical Plaza',
            street2: 'Building A',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
            country: 'USA',
            isMilitary: true,
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.currently_hospitalized).to.be.true;
      expect(result.hospitalization_admission_date).to.equal('2024-01-15');
      expect(result.hospitalization_facility_name).to.equal(
        'Starfleet Medical Center',
      );
      expect(result.hospitalization_facility_address.street).to.equal(
        '1 Starfleet Medical Plaza',
      );
      expect(result.hospitalization_facility_address.street2).to.equal(
        'Building A',
      );
      expect(result.hospitalization_facility_address.city).to.equal(
        'San Francisco',
      );
      expect(result.hospitalization_facility_address.state).to.equal('CA');
      expect(result.hospitalization_facility_address.postal_code).to.equal(
        '94102',
      );
      expect(result.hospitalization_facility_address.is_military).to.be.true;
    });
  });

  describe('Statement of Truth', () => {
    it('should generate statement of truth signature from claimant name', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            last: 'Doe',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.statement_of_truth_signature).to.equal('Jane Doe');
      expect(result.statement_of_truth_certified).to.be.true;
    });

    it('should generate statement of truth signature from veteran name when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        veteranIdentification: {
          veteranFullName: {
            first: 'John',
            last: 'Smith',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.statement_of_truth_signature).to.equal('John Smith');
    });

    it('should handle missing names gracefully in signature', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {},
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.statement_of_truth_signature).to.equal('');
    });
  });

  describe('Missing or Empty Data', () => {
    it('should handle completely empty form data', () => {
      const formData = {};
      const result = submitTransformer(mockFormConfig, formData);

      expect(result).to.be.an('object');
      expect(result.form_number).to.equal('21-2680');
      expect(result.veteran_full_name.first).to.equal('');
      expect(result.claimant_full_name.first).to.equal('');
    });

    it('should handle partial veteran name', () => {
      const formData = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Bob',
            last: 'Jones',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_full_name.first).to.equal('Bob');
      expect(result.veteran_full_name.middle).to.equal('');
      expect(result.veteran_full_name.last).to.equal('Jones');
      expect(result.veteran_full_name.suffix).to.equal('');
    });

    it('should handle partial address', () => {
      const formData = {
        veteranAddress: {
          veteranAddress: {
            street: '789 Pine St',
            city: 'Seattle',
            state: 'WA',
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_mailing_address.street).to.equal('789 Pine St');
      expect(result.veteran_mailing_address.street2).to.equal('');
      expect(result.veteran_mailing_address.street3).to.equal('');
      expect(result.veteran_mailing_address.postal_code).to.equal('');
      expect(result.veteran_mailing_address.country).to.equal('USA');
      expect(result.veteran_mailing_address.is_military).to.equal(false);
    });

    it('should handle empty SSN', () => {
      const formData = {
        veteranIdentification: {
          veteranSSN: '',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      expect(result.veteran_id.ssn).to.equal('');
    });
  });

  describe('Complete Form Submission', () => {
    it('should correctly transform minimal test data (veteran as claimant, not hospitalized)', () => {
      const formData = {
        veteranIdentification: {
          veteranFullName: {
            first: 'James',
            middle: 'Tiberius',
            last: 'Kirk',
            suffix: '',
          },
          veteranSSN: '123-45-6789',
          veteranDOB: '2233-03-22',
        },
        veteranAddress: {
          veteranAddress: {
            street: '123 Starfleet Command Blvd',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            postalCode: '94102',
            isMilitary: false,
          },
        },
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
        claimantContact: {
          claimantPhoneNumber: '4155551234',
          claimantMobilePhone: '4155555678',
          claimantEmail: 'james.kirk@starfleet.mil',
        },
        benefitType: {
          benefitType: 'SMC',
        },
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'no',
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      // Verify all major sections
      expect(result.form_number).to.equal('21-2680');
      expect(result.veteran_full_name.first).to.equal('James');
      expect(result.veteran_id.ssn).to.equal('123456789');
      expect(result.claimant_relationship).to.equal('veteran');
      expect(result.claimant_full_name.first).to.equal('James');
      expect(result.benefit_type).to.equal('SMC');
      expect(result.currently_hospitalized).to.be.false;
      expect(result.phone_number).to.equal('4155551234');
      expect(result).to.not.have.property('hospitalization_admission_date');
    });

    it('should correctly transform maximal test data (separate claimant, hospitalized)', () => {
      const formData = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Jean-Luc',
            middle: 'Pierre',
            last: 'Picard',
            suffix: '',
          },
          veteranSSN: '987-65-4321',
          veteranDOB: '2305-07-13',
        },
        veteranAddress: {
          veteranAddress: {
            street: '456 Enterprise Way',
            street2: 'Deck 1',
            city: 'La Barre',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            isMilitary: false,
          },
        },
        claimantRelationship: {
          claimantRelationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Beverly',
            middle: 'Anne',
            last: 'Crusher',
            suffix: '',
          },
          claimantDOB: '2324-10-13',
        },
        claimantSSN: {
          claimantSSN: '111-22-3333',
        },
        claimantAddress: {
          claimantAddress: {
            street: '789 Medical Bay Road',
            street2: 'Apt 3B',
            city: 'San Diego',
            state: 'CA',
            postalCode: '92101',
            country: 'USA',
            isMilitary: false,
          },
        },
        claimantContact: {
          claimantPhoneNumber: '6195551234',
          claimantMobilePhone: '6195555678',
          claimantEmail: 'beverly.crusher@starfleet.mil',
        },
        benefitType: {
          benefitType: 'SMP',
        },
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'yes',
        },
        hospitalizationDate: {
          admissionDate: '2024-01-15',
        },
        hospitalizationFacility: {
          facilityName: 'Starfleet Medical Center',
          facilityAddress: {
            street: '1 Starfleet Medical Plaza',
            street2: 'Building A',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
            country: 'USA',
            isMilitary: true,
          },
        },
      };
      const result = submitTransformer(mockFormConfig, formData);

      // Verify all major sections
      expect(result.form_number).to.equal('21-2680');
      expect(result.veteran_full_name.first).to.equal('Jean-Luc');
      expect(result.veteran_id.ssn).to.equal('987654321');
      expect(result.claimant_relationship).to.equal('spouse');
      expect(result.claimant_full_name.first).to.equal('Beverly');
      expect(result.claimant_ssn).to.equal('111223333');
      expect(result.benefit_type).to.equal('SMP');
      expect(result.currently_hospitalized).to.be.true;
      expect(result.hospitalization_admission_date).to.equal('2024-01-15');
      expect(result.hospitalization_facility_name).to.equal(
        'Starfleet Medical Center',
      );
      expect(result.phone_number).to.equal('6195551234');
      expect(result.statement_of_truth_signature).to.equal('Beverly Crusher');
    });
  });
});
