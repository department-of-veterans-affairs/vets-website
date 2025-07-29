import { expect } from 'chai';
import { MissingFieldsException } from '../../../utils/exceptions/MissingFieldsException';

describe('Dispute Debt PDF template', () => {
  let template;
  let validate;

  beforeEach(() => {
    template = require('../../../templates/dispute_debt');
    validate = template.validate;
  });

  describe('Validation function', () => {
    let validData;

    beforeEach(() => {
      validData = require('./fixture.json');
    });

    it('should pass validation with complete valid data', () => {
      expect(() => validate(validData)).to.not.throw();
    });

    it('should throw MissingFieldsException when top-level data fields are missing', () => {
      const invalidData = {};

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'The following fields are required: data.selectedDebts, data.submissionDetails, data.veteran',
      );
    });

    it('should throw MissingFieldsException when selectedDebts is missing', () => {
      const invalidData = {
        ...validData,
        selectedDebts: undefined,
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'data.selectedDebts',
      );
    });

    it('should throw MissingFieldsException when selectedDebts is empty array', () => {
      const invalidData = {
        ...validData,
        selectedDebts: [],
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'selectedDebts (must be a non-empty array)',
      );
    });

    it('should throw MissingFieldsException when submissionDetails.submissionDateTime is missing', () => {
      const invalidData = {
        ...validData,
        submissionDetails: {},
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'submissionDetails.submissionDateTime',
      );
    });

    it('should throw MissingFieldsException when veteran required fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          veteranFullName: validData.veteran.veteranFullName,
          mailingAddress: validData.veteran.mailingAddress,
          mobilePhone: validData.veteran.mobilePhone,
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.dob.*veteran\.ssnLastFour.*veteran\.email/,
      );
    });

    it('should throw MissingFieldsException when veteranFullName fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          veteranFullName: {
            middle: 'Michael',
            suffix: 'Jr',
          },
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.veteranFullName\.first.*veteran\.veteranFullName\.last/,
      );
    });

    it('should throw MissingFieldsException when mailingAddress fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mailingAddress: {
            addressLine2: 'Apt 4B',
            addressLine3: '',
          },
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.mailingAddress\.addressLine1.*veteran\.mailingAddress\.city.*veteran\.mailingAddress\.countryName.*veteran\.mailingAddress\.zipCode.*veteran\.mailingAddress\.stateCode/,
      );
    });

    it('should throw MissingFieldsException when mobilePhone fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mobilePhone: {
            extension: '123',
          },
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.mobilePhone\.phoneNumber.*veteran\.mobilePhone\.countryCode.*veteran\.mobilePhone\.areaCode/,
      );
    });

    it('should throw MissingFieldsException when debt fields are missing', () => {
      const invalidData = {
        ...validData,
        selectedDebts: [
          {
            deductionCode: '41',
          },
          {
            label: 'Valid debt',
            disputeReason: 'Valid reason',
            supportStatement: 'Valid statement',
          },
        ],
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /selectedDebts\[0\]\.label.*selectedDebts\[0\]\.disputeReason.*selectedDebts\[0\]\.supportStatement/,
      );
    });

    it('should handle multiple missing fields correctly', () => {
      const invalidData = {
        selectedDebts: [
          {
            // missing all required debt fields
          },
        ],
        submissionDetails: {
          // missing submissionDateTime
        },
        veteran: {
          // missing all required veteran fields
        },
      };

      try {
        validate(invalidData);
        expect.fail('Should have thrown MissingFieldsException');
      } catch (error) {
        expect(error).to.be.instanceOf(MissingFieldsException);
        expect(error.message).to.include(
          'submissionDetails.submissionDateTime',
        );
        expect(error.message).to.include('veteran.dob');
        expect(error.message).to.include('selectedDebts[0].label');
      }
    });

    it('should create proper field path names for error reporting', () => {
      const invalidData = {
        selectedDebts: [
          {
            // All fields missing
          },
        ],
        submissionDetails: {},
        veteran: {
          veteranFullName: {},
          mailingAddress: {},
          mobilePhone: {},
        },
      };

      try {
        validate(invalidData);
        expect.fail('Should have thrown MissingFieldsException');
      } catch (error) {
        expect(error).to.be.instanceOf(MissingFieldsException);
        // Check that field paths are properly constructed
        expect(error.message).to.include(
          'submissionDetails.submissionDateTime',
        );
        expect(error.message).to.include('veteran.dob');
        expect(error.message).to.include('veteran.veteranFullName.first');
        expect(error.message).to.include('veteran.mailingAddress.addressLine1');
        expect(error.message).to.include('veteran.mobilePhone.phoneNumber');
        expect(error.message).to.include('selectedDebts[0].label');
      }
    });

    it('should validate all debt entries when multiple debts are provided', () => {
      const invalidData = {
        ...validData,
        selectedDebts: [
          {
            label: 'Valid debt',
            disputeReason: 'Valid reason',
            supportStatement: 'Valid statement',
          },
          {
            // Second debt missing required fields
            label: 'Invalid debt',
          },
          {
            // Third debt missing all fields
          },
        ],
      };

      try {
        validate(invalidData);
        expect.fail('Should have thrown MissingFieldsException');
      } catch (error) {
        expect(error).to.be.instanceOf(MissingFieldsException);
        expect(error.message).to.include('selectedDebts[1].disputeReason');
        expect(error.message).to.include('selectedDebts[1].supportStatement');
        expect(error.message).to.include('selectedDebts[2].label');
        expect(error.message).to.include('selectedDebts[2].disputeReason');
        expect(error.message).to.include('selectedDebts[2].supportStatement');
      }
    });
  });

  describe('Basic functionality', () => {
    it('should export generate function', () => {
      expect(template.generate).to.be.a('function');
    });

    it('should export validate function', () => {
      expect(template.validate).to.be.a('function');
    });
  });
});
