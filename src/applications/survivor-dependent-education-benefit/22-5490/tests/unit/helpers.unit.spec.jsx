import { expect } from 'chai';
import sinon from 'sinon';

import {
  isOnlyWhitespace,
  isAlphaNumeric,
  titleCase,
  obfuscate,
  formatReadableDate,
  addWhitespaceOnlyError,
  transformAlphaOnlyLowercase,
  equalsAlphaOnlyIgnoreCase,
  prefillTransformer,
} from '../../helpers';

describe('Helpers Module', () => {
  describe('isOnlyWhitespace', () => {
    it('should return true for strings containing only spaces', () => {
      expect(isOnlyWhitespace(' ')).to.be.true;
    });
    it('should return true for strings containing only tabs and newlines', () => {
      expect(isOnlyWhitespace('\t\n\t')).to.be.true;
    });
    it('should return false for strings containing non-whitespace characters', () => {
      expect(isOnlyWhitespace('abc')).to.be.false;
    });
    it('should return false for strings with whitespace and non-whitespace characters', () => {
      expect(isOnlyWhitespace('  abc  ')).to.be.false;
    });
    it('should return undefined when input is undefined', () => {
      expect(isOnlyWhitespace(undefined)).to.be.undefined;
    });
  });
  describe('isAlphaNumeric', () => {
    it('should return true for alphanumeric strings', () => {
      expect(isAlphaNumeric('abc123')).to.be.true;
    });
    it('should return false for strings with special characters', () => {
      expect(isAlphaNumeric('abc123!')).to.be.false;
    });
    it('should return false for strings with spaces', () => {
      expect(isAlphaNumeric('abc 123')).to.be.false;
    });
    it('should return true for strings with only letters', () => {
      expect(isAlphaNumeric('abcdef')).to.be.true;
    });
    it('should return true for strings with only numbers', () => {
      expect(isAlphaNumeric('123456')).to.be.true;
    });
    it('should return false for empty strings', () => {
      expect(isAlphaNumeric('')).to.be.false;
    });
  });
  describe('titleCase', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(titleCase('hello')).to.equal('Hello');
    });
    it('should handle uppercase strings', () => {
      expect(titleCase('HELLO')).to.equal('Hello');
    });
    it('should handle mixed case strings', () => {
      expect(titleCase('hElLo')).to.equal('Hello');
    });
    it('should handle single-character strings', () => {
      expect(titleCase('h')).to.equal('H');
    });
    it('should throw an error for empty strings', () => {
      expect(() => titleCase('')).to.throw();
    });
    it('should throw an error when input is null or undefined', () => {
      expect(() => titleCase(null)).to.throw();
      expect(() => titleCase(undefined)).to.throw();
    });
  });
  describe('obfuscate', () => {
    it('should obfuscate all but the last 4 characters by default', () => {
      expect(obfuscate('1234567890')).to.equal('●●●●●●7890');
    });
    it('should use custom number of visible characters', () => {
      expect(obfuscate('1234567890', 2)).to.equal('●●●●●●●●90');
    });
    it('should use custom obfuscation character', () => {
      expect(obfuscate('1234567890', 4, '*')).to.equal('******7890');
    });
    it('should return the original string if length is less than or equal to numVisibleChars', () => {
      expect(obfuscate('1234')).to.equal('1234');
    });
    it('should return an empty string when input is empty', () => {
      expect(obfuscate('')).to.equal('');
    });
    it('should return an empty string when input is null or undefined', () => {
      expect(obfuscate(null)).to.equal('');
      expect(obfuscate(undefined)).to.equal('');
    });
  });
  describe('formatReadableDate', () => {
    it('should format a valid date string correctly', () => {
      expect(formatReadableDate('2000-01-01')).to.equal('January 1, 2000');
    });
    xit('should return an empty string for invalid date formats', () => {
      expect(formatReadableDate('invalid-date')).to.equal('');
    });
    it('should return an empty string when input is null or undefined', () => {
      expect(formatReadableDate(null)).to.equal('');
      expect(formatReadableDate(undefined)).to.equal('');
    });
  });
  describe('addWhitespaceOnlyError', () => {
    xit('should add an error if the field contains only whitespace', () => {
      const errors = { addError: sinon.spy() };
      addWhitespaceOnlyError('   ', errors, 'Field cannot be empty');
      expect(errors.addError.calledOnceWith('Field cannot be empty')).to.be
        .true;
    });
    it('should not add an error if the field contains non-whitespace characters', () => {
      const errors = { addError: sinon.spy() };
      addWhitespaceOnlyError('abc', errors, 'Field cannot be empty');
      expect(errors.addError.notCalled).to.be.true;
    });
  });
  describe('transformAlphaOnlyLowercase', () => {
    it('should transform string to lowercase and remove non-alpha characters', () => {
      expect(transformAlphaOnlyLowercase('Abc123!@#')).to.equal('abc');
    });
    it('should return an empty string when input has no alphabetic characters', () => {
      expect(transformAlphaOnlyLowercase('12345!@#')).to.equal('');
    });
    it('should throw an error when input is null or undefined', () => {
      expect(() => transformAlphaOnlyLowercase(null)).to.throw();
      expect(() => transformAlphaOnlyLowercase(undefined)).to.throw();
    });
  });
  describe('equalsAlphaOnlyIgnoreCase', () => {
    it('should return true for strings that are equal when non-alpha characters are removed', () => {
      expect(equalsAlphaOnlyIgnoreCase('Abc123', 'aBc!@#123')).to.be.true;
    });
    it('should return false for strings that are not equal after transformation', () => {
      expect(equalsAlphaOnlyIgnoreCase('abc', 'def')).to.be.false;
    });
    it('should handle empty strings', () => {
      expect(equalsAlphaOnlyIgnoreCase('', '')).to.be.true;
    });
    it('should throw an error when input is null or undefined', () => {
      expect(() => equalsAlphaOnlyIgnoreCase(null, 'abc')).to.throw();
      expect(() => equalsAlphaOnlyIgnoreCase('abc', null)).to.throw();
    });
  });
  describe('prefillTransformer', () => {
    it('should correctly transform form data based on the provided state', () => {
      const pages = {};
      const formData = {
        relationShipToMember: 'Spouse',
        relativeSocialSecurityNumber: '123-45-6789',
        highSchoolDiploma: 'Yes',
        graduationDate: '2000-01-01',
        marriageStatus: 'Married',
        marriageDate: '2000-01-01',
        remarriageStatus: 'Not Remarried',
        remarriageDate: '2000-01-01',
        felonyOrWarrant: 'No',
        chosenBenefit: 'Some Benefit',
        contactMethod: 'Email',
        declineDirectDeposit: false,
        bankAccount: {
          accountType: 'Checking',
          accountNumber: '123456789',
          routingNumber: '987654321',
        },
      };
      const metadata = {};
      const state = {
        data: {
          bankInformation: {
            accountType: 'Checking',
            accountNumber: '123456789',
            routingNumber: '987654321',
          },
          formData: {
            data: {
              id: '123',
              attributes: {
                claimant: {
                  claimantId: '456',
                  firstName: 'John',
                  middleName: 'M',
                  lastName: 'Doe',
                  suffix: 'Jr',
                  contactInfo: {
                    emailAddress: 'john.doe@example.com',
                    mobilePhoneNumber: '555-555-5555',
                    homePhoneNumber: '444-444-4444',
                    addressLine1: '123 Main St',
                    city: 'Anytown',
                    stateCode: 'CA',
                    zipcode: '12345',
                    countryCodeIso3: 'USA',
                    addressType: 'DOMESTIC',
                  },
                },
                sponsors: ['Sponsor1', 'Sponsor2'],
              },
            },
          },
        },
        user: {
          profile: {
            userFullName: {
              first: 'Jane',
              middle: 'A',
              last: 'Smith',
            },
            email: 'jane.smith@va.gov',
            vapContactInfo: {
              email: {
                emailAddress: 'jane.smith@example.com',
              },
              mobilePhone: {
                areaCode: '555',
                phoneNumber: '6667777',
                isInternational: false,
              },
              homePhone: {
                areaCode: '555',
                phoneNumber: '8889999',
                isInternational: false,
              },
              mailingAddress: {
                addressLine1: '456 Elm St',
                city: 'Othertown',
                stateCode: 'NY',
                zipcode: '67890',
                countryCodeIso3: 'USA',
                addressType: 'DOMESTIC',
              },
            },
          },
        },
      };
      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData.claimantFullName.first).to.equal('Jane');
      expect(result.formData.claimantFullName.middle).to.equal('A');
      expect(result.formData.claimantFullName.last).to.equal('Smith');
      expect(result.formData.email).to.equal('jane.smith@example.com');
      expect(result.formData.confirmEmail).to.equal('jane.smith@example.com');
      expect(result.formData.mobilePhone.phone).to.equal('5556667777');
      expect(result.formData.mobilePhone.isInternational).to.be.false;
      expect(result.formData.homePhone.phone).to.equal('5558889999');
      expect(result.formData.homePhone.isInternational).to.be.false;
      expect(result.formData.mailingAddressInput.address.street).to.equal(
        '456 Elm St',
      );
      expect(result.formData.mailingAddressInput.address.city).to.equal(
        'Othertown',
      );
      expect(result.formData.mailingAddressInput.address.state).to.equal('NY');
      expect(result.formData.mailingAddressInput.address.postalCode).to.equal(
        '67890',
      );
      expect(result.formData.mailingAddressInput.address.country).to.equal(
        'USA',
      );
      expect(result.formData.mailingAddressInput.livesOnMilitaryBase).to.be
        .false;
      expect(result.formData.bankAccount.accountType).to.equal('Checking');
      expect(result.formData.bankAccount.accountNumber).to.equal('123456789');
      expect(result.formData.bankAccount.routingNumber).to.equal('987654321');
      expect(result.formData.claimantId).to.equal('456');
      expect(result.formData.formId).to.equal('123');
    });
  });
});
