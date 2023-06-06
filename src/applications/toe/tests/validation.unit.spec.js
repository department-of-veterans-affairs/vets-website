import { expect } from 'chai';
import { isValidGivenName, isValidLastName } from '../utils/validation';

describe('first middle name validation', () => {
  describe('valid given names', () => {
    it('Jane is a valid name', () => {
      const name = 'Jane';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Single-character names are valid', () => {
      const name = 'Q';
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
    it('Name with prime is valid', () => {
      const name = "Ter'Rico";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with apostrophe is valid', () => {
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
      const name = "    J'ne Ter’Rico-Kaiden      ";
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

  describe('valid last names', () => {
    it('Johnson is a valid last name', () => {
      const name = 'Johnson';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Single-character last names are valid', () => {
      const name = 'X';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with leading spaces is valid', () => {
      const name = '                    Johnson';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with trailing spaces is valid', () => {
      const name = 'Johnson                    ';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with hyphen is valid', () => {
      const name = 'Johnson-Johnston';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with prime is valid', () => {
      const name = "M'Cheyne";
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with apostrophe is valid', () => {
      const name = 'M’Cheyne';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with space is valid', () => {
      const name = 'Johnson Johnston';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with 26 characters and leading and trailing whitespace is valid', () => {
      const name = '  Johnson-Johnston-Jo-Jordan  ';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });

    it('Last name without leading letter is not valid', () => {
      const name = '-Johns';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name without leading letter 2 is not valid', () => {
      const name = "'Johns";
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name without leading letter 3 is not valid', () => {
      const name = '’Johns';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name with 27 characters is not valid', () => {
      const name = 'Johnson-Jensen-Jordan-Jones';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name with number is not valid', () => {
      const name = 'J3n53n';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name with $ is not valid', () => {
      const name = 'Jone$';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
  });
});
