import { expect } from 'chai';
import { isValidGivenName } from '../utils/validation';

describe('first middle name validation', () => {
  describe('valid given names', () => {
    it('Jane is a valid name', () => {
      const name = 'Jane';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with leading spaces is valid', () => {
      const name = '                    Jane';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with trailing spaces is valid', () => {
      const name = 'George                    ';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with hyphen is valid', () => {
      const name = 'George-Lawrence';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with apostrophe is valid', () => {
      const name = "Ter'Rico";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with prime is valid', () => {
      const name = 'Ter’Rico';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with space is valid', () => {
      const name = 'Jane Louise';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with 20 characters and leading and trailing whitespace is valid', () => {
      const name = "     J'ne Ter’Rico-Kaiden       ";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });

    it('Name without leading letter is not valid', () => {
      const name = '-Nope';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name without leading letter 2 is not valid', () => {
      const name = "'Nope";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name without leading letter 3 is not valid', () => {
      const name = '’Nope';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name with 21 characters is not valid', () => {
      const name = 'Jane Jane Jane Jane L';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name with number is not valid', () => {
      const name = 'King George 3';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name with $ is not valid', () => {
      const name = 'Name$';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
  });
});
