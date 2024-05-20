import { expect } from 'chai';

import constants from 'vets-json-schema/dist/constants.json';

import { nameToValue, valueToName } from '../../utils/country-mapping';

describe('country-mapping', () => {
  describe('nameToValue', () => {
    it('returns the value for a known country name', () => {
      const countryName = constants.countries[0].label;
      const expectedValue = constants.countries[0].value;

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

    it('returns the input if the country value is unknown', () => {
      const countryValue = 'Unknown Value';

      expect(valueToName(countryValue)).to.equal(countryValue);
    });
  });
});
