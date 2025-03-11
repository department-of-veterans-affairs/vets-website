import { expect } from 'chai';
import { CountriesList, types } from '../../utils/mapbox';

describe('Mapbox Utils', () => {
  describe('Constants', () => {
    it('should have correct countries list', () => {
      expect(CountriesList).to.deep.equal(['us', 'pr', 'ph', 'gu', 'as', 'mp']);
    });

    it('should have correct types', () => {
      expect(types).to.deep.equal(['place', 'region', 'postcode', 'locality']);
    });
  });
});
