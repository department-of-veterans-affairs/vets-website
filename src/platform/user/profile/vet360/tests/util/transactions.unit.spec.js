import { expect } from 'chai';

import { addCountryCodeIso3ToAddress } from 'vet360/util/transactions';

describe('addCountryCodeIso3ToAddress', () => {
  describe('when passed an object with a countryName', () => {
    describe('and the countryName is valid', () => {
      it('adds the countryCodeIso3 prop', () => {
        const address = {
          countryName: 'United States',
        };
        const output = addCountryCodeIso3ToAddress(address);
        expect(output).to.deep.equal({
          countryName: 'United States',
          countryCodeIso3: 'USA',
        });
      });
    });
    describe('and the countryName is not valid', () => {
      it('simply returns the data it was passed', () => {
        const address = {
          countryName: 'Not A Real Country',
        };
        const output = addCountryCodeIso3ToAddress(address);
        expect(output).to.deep.equal(address);
      });
    });
  });
  describe('when passed an object without a countryName', () => {
    it('returns the data it was passed', () => {
      const address = {
        state: 'CA',
        street1: '123 Main St',
      };
      const output = addCountryCodeIso3ToAddress(address);
      expect(output).to.deep.equal(address);
    });
  });
});
