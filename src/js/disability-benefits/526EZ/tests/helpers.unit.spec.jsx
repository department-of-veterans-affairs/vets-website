import { expect } from 'chai';
import { flatten, isPrefillDataComplete, prefillTransformer,
  mergeStateLists, labelStateCodes, mergeAndLabelStateCodes } from '../helpers.jsx';
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
const labeledStateList = labelStateCodes(['AA', 'AZ']);
const mergedAndLabeledStateList = mergeAndLabelStateCodes(['AA', 'AZ']);
const Philippines = { label: 'Philippine Islands', value: 'PI' };
const AA = { label: 'Armed Forces Americas (AA)', value: 'AA' };
const mergedMultipleStateList = mergeStateLists([
  [
    Philippines,
    { label: 'U.S. Minor Outlying Islands', value: 'UM' }
  ], [
    Philippines,
    AA,
    { label: 'Armed Forces Europe (AE)', value: 'AE' },
    { label: 'Armed Forces Pacific (AP)', value: 'AP' },
  ]
]);
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
  describe('mergeStateLists', () => {
    it('should merge multiple lists', () => {
      expect(mergedMultipleStateList[3].value).to.equal('AP');
    });
    it('should deduplicate multiple lists', () => {
      expect(mergedMultipleStateList.filter(item => item.value === 'PI').length).to.equal(1);
    });
    it('sort multiple lists', () => {
      expect(mergedMultipleStateList.indexOf(AA)).to.be.greaterThan(mergedMultipleStateList.indexOf(Philippines));
    });
  });
  describe('labelStateCodes', () => {
    it('should label state codes', () => {
      expect(labeledStateList[1].label).to.equal('Arizona');
    });
  });
  describe('mergeAndLabelStateCodes', () => {
    it('should merge state codes with military state codes', () => {
      expect(mergedAndLabeledStateList[0].value).to.equal('AA');
    });
  });
});
