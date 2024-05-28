import { expect } from 'chai';

import constants from 'vets-json-schema/dist/constants.json';

import {
  caseInsensitiveComparison,
  nameToValue,
  valueToName,
} from '../../utils/country-mapping';

describe('country-mapping', () => {
  describe('nameToValue', () => {
    it('returns the value for a known country name', () => {
      const countryName = constants.countries[0].label;
      const expectedValue = constants.countries[0].value;

      expect(nameToValue(countryName)).to.equal(expectedValue);
    });

    it('returns the value for a known country name (case insensitive)', () => {
      const countryName = constants.countries[0].label.toUpperCase();
      const expectedValue = constants.countries[0].value;

      expect(nameToValue(countryName)).to.equal(expectedValue);
    });

    it('maps from DLC APO Country format', () => {
      const countryName = 'ARMED FORCES AF,EU,ME,CA';
      const expectedValue = 'USA';

      expect(nameToValue(countryName)).to.equal(expectedValue);
    });

    it('returns the input if the country name is unknown', () => {
      const countryName = 'Unknown Country';

      expect(nameToValue(countryName)).to.equal(countryName);
    });
  });

  describe('valueToName', () => {
    it('returns the name for a known country value', () => {
      const countryValue = constants.countries[0].value;
      const expectedName = constants.countries[0].label;

      expect(valueToName(countryValue)).to.equal(expectedName);
    });

    it('returns the name for a known country value (case insensitive)', () => {
      const countryValue = constants.countries[0].value.toUpperCase();
      const expectedName = constants.countries[0].label;

      expect(valueToName(countryValue)).to.equal(expectedName);
    });

    it('returns the input if the country value is unknown', () => {
      const countryValue = 'Unknown Value';

      expect(valueToName(countryValue)).to.equal(countryValue);
    });
  });

  describe('caseInsensitiveComparison', () => {
    it('returns true for case-insensitive match', () => {
      const a = 'United States';
      const b = 'united states';

      expect(caseInsensitiveComparison(a, b)).to.be.true;
    });

    it('returns false for non-matching strings', () => {
      const a = 'United States';
      const b = 'Canada';

      expect(caseInsensitiveComparison(a, b)).to.be.false;
    });

    it('returns true for non-string identical values', () => {
      const a = 123;
      const b = 123;

      expect(caseInsensitiveComparison(a, b)).to.be.true;
    });

    it('returns false for non-string different values', () => {
      const a = 123;
      const b = 456;

      expect(caseInsensitiveComparison(a, b)).to.be.false;
    });
  });
});
