import { expect } from 'chai';
import { flatten, nest } from '../../../src/js/disability-benefits/526EZ/helpers.jsx';
import initialData from './schema/initialData.js';

const formData = initialData;
const treatments = [
    {
      "treatment": {
      "treatmentCenterName": "asdf"
      }
    }
  ];
initialData.disabilities[0].treatments = treatments;
const flattened = flatten(formData)

describe('526 helpers', () => {
  describe('flatten', () => {
    it('should flatten sibling arrays', () => {
      expect(flattened.treatments).to.exist;
      expect(flattened.disabilities[0].treatments).to.not.exist;
    });
  });
  describe('nest', () => {
    it('should nest sibling arrays', () => {
      const nested = nest(flattened)
      expect(nested).to.deep.equal(formData);
    });
  });
});

