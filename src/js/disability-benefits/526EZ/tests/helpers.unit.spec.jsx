import { expect } from 'chai';
import {
  flatten,
  isPrefillDataComplete,
  prefillTransformer,
  // mergeStateLists,
  // mergeAndLabelStateCodes
} from '../helpers.jsx';
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
// const mergedAndLabeledStateList = mergeAndLabelStateCodes(['AA', 'AZ']);
// const mergedSingleStateList = mergeStateLists([
//   { label: 'Philippine Islands', value: 'PI' },
//   { label: 'U.S. Minor Outlying Islands', value: 'UM' }
// ]);
// const mergedMultipleStateList = mergeStateLists([
//   [
//     { label: 'Philippine Islands', value: 'PI' },
//     { label: 'U.S. Minor Outlying Islands', value: 'UM' }
//   ], [
//     { label: 'Armed Forces Americas (AA)', value: 'AA' },
//     { label: 'Armed Forces Europe (AE)', value: 'AE' },
//     { label: 'Armed Forces Pacific (AP)', value: 'AP' },
//   ]
// ]);
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
  // describe('mergeStateLists', () => {
  //   it('should return a single list', () => {
  //     expect(mergedSingleStateList[1].label).to.equal('Arizona');
  //   });
  //   it('should merge multiple lists', () => {
  //     expect(mergedMultipleStateList[3].value).to.equal('AP');
  //   });
  // });
  // describe('mergeAndLabelStateCodes', () => {
  //   it('should label state codes', () => {
  //     expect(mergedAndLabeledStateList[1].value).to.equal('UM');
  //   });
  //   it('should merge state codes with military state codes', () => {
  //     expect(mergedAndLabeledStateList[3].value).to.equal('AE');
  //   });
  // });
});
