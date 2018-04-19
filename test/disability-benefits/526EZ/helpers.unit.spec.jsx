import { expect } from 'chai';
import {
  flatten,
  isPrefillDataComplete,
  prefillTransformer
} from '../../../src/js/disability-benefits/526EZ/helpers.jsx';
import initialData from './schema/initialData.js';

delete initialData.prefilled;
const treatments = [
  {
    treatment: {
      treatmentCenterName: 'local VA center'
    }
  }
];
initialData.disabilities[0].treatments = treatments;
const flattened = flatten(initialData);
const completeData = initialData;
const incompleteData = {};
const { formData: transformedPrefill } = prefillTransformer([], initialData, {}, { prefilStatus: 'success' });
const { formData: incompletePrefill } = prefillTransformer([], {}, {}, { prefilStatus: 'success' });

describe('526 helpers', () => {
  describe('flatten', () => {
    it('should flatten sibling arrays', () => {
      expect(flattened.treatments).to.exist;
      expect(flattened.disabilities[0].treatments).to.not.exist;
    });
  });
  describe('isPrefillDataComplete', () => {
    it('should reject incomplete prefilled data', () => {
      expect(isPrefillDataComplete(incompleteData)).to.equal(false);
    });
    it('should accept complete prefilled data', () => {
      expect(isPrefillDataComplete(completeData)).to.equal(true);
    });
  });
  describe('prefillTransformer', () => {
    it('should record if the form was prefilled', () => {
      expect(transformedPrefill.prefilled).to.be.true;
    });
    it('should not record if the form was not completely prefilled', () => {
      expect(incompletePrefill.prefilled).to.be.undefined;
    });
  });
});
