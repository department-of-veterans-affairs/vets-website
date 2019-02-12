import { expect } from 'chai';

import {
  minPrefillData,
  minTransformedPrefillData,
  maxPrefillData,
  transformedMaxPrefillData,
} from './schema/prefillData';

import { prefillTransformer } from '../../0994/prefill-transformer';

describe('prefillTransformer', () => {
  it('should transform prefill data correctly', () => {
    expect(prefillTransformer({}, maxPrefillData, {}).formData).to.deep.equal(
      transformedMaxPrefillData,
    );
  });

  it('should transform prefill data correctly if no bankAccount', () => {
    expect(prefillTransformer({}, minPrefillData, {}).formData).to.deep.equal(
      minTransformedPrefillData,
    );
  });
});
