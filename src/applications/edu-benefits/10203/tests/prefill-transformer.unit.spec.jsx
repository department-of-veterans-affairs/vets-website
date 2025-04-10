import { expect } from 'chai';

import {
  minPrefillData,
  minTransformedPrefillData,
  maxPrefillData,
  transformedMaxPrefillData,
  stateData,
} from './schema/prefillData';

import { prefillTransformer } from '../prefill-transformer';

describe('prefillTransformer', () => {
  it('should transform minimal prefill data correctly', () => {
    expect(
      prefillTransformer({}, minPrefillData, {}, stateData).formData,
    ).to.deep.equal(minTransformedPrefillData);
  });
  it('should transform maximal prefill data correctly', () => {
    expect(
      prefillTransformer({}, maxPrefillData, {}, stateData).formData,
    ).to.deep.equal(transformedMaxPrefillData);
  });
});
