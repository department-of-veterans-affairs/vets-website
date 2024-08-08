import { expect } from 'chai';

import constants from 'vets-json-schema/dist/constants.json';

import {
  caseInsensitiveComparison,
  countryNameToValue,
  countryValueToName,
  isMilitaryState,
  isTerritory,
  usTerritories,
} from '../../utils/addresses';

describe('country-mapping', () => {
  describe('countryNameToValue', () => {
    it('returns the value for a known country name', () => {
      const countryName = constants.countries[0].label;
      const expectedValue = constants.countries[0].value;

      expect(countryNameToValue(countryName)).to.equal(expectedValue);
    });

    it('returns the value for a known country name (case insensitive)', () => {
      const countryName = constants.countries[0].label.toUpperCase();
      const expectedValue = constants.countries[0].value;

      expect(countryNameToValue(countryName)).to.equal(expectedValue);
    });

    it('maps from DLC APO Country format', () => {
      const countryName = 'ARMED FORCES AF,EU,ME,CA';
      const expectedValue = 'USA';

      expect(countryNameToValue(countryName)).to.equal(expectedValue);
    });

    it('returns the input if the country name is unknown', () => {
      const countryName = 'Unknown Country';

      expect(countryNameToValue(countryName)).to.equal(countryName);
    });
  });

  describe('countryValueToName', () => {
    it('returns the name for a known country value', () => {
      const countryValue = constants.countries[0].value;
      const expectedName = constants.countries[0].label;

      expect(countryValueToName(countryValue)).to.equal(expectedName);
    });

    it('returns the name for a known country value (case insensitive)', () => {
      const countryValue = constants.countries[0].value.toUpperCase();
      const expectedName = constants.countries[0].label;

      expect(countryValueToName(countryValue)).to.equal(expectedName);
    });

    it('returns the input if the country value is unknown', () => {
      const countryValue = 'Unknown Value';

      expect(countryValueToName(countryValue)).to.equal(countryValue);
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

  describe('isMilitaryState', () => {
    it('returns true for a military state', () => {
      const militaryState = constants.militaryStates[0].value;

      expect(isMilitaryState(militaryState)).to.be.true;
    });

    it('returns false for a non-military state', () => {
      const nonMilitaryState = 'CO';

      expect(isMilitaryState(nonMilitaryState)).to.be.false;
    });
  });

  describe('usTerritories', () => {
    it('returns only territories', () => {
      const territories = usTerritories();

      // Check that all returned names are indeed territories
      territories.forEach(territory => {
        const isState = constants.states50AndDC.some(
          state => state.label === territory,
        );
        const isMilState = constants.militaryStates.some(
          state => state.label === territory,
        );
        expect(isState).to.be.false;
        expect(isMilState).to.be.false;
      });
    });
  });

  describe('isTerritory', () => {
    it('returns true for a territory', () => {
      const territory = usTerritories()[0];
      expect(isTerritory(territory)).to.be.true;
    });

    it('returns false for a non-territory state', () => {
      const nonTerritoryState = constants.states50AndDC[0].label;
      expect(isTerritory(nonTerritoryState)).to.be.false;
    });

    it('returns false for a military state', () => {
      const militaryState = constants.militaryStates[0].label;
      expect(isTerritory(militaryState)).to.be.false;
    });
  });
});
