import { expect } from 'chai';
import { prefillTransformer } from '../prefill-transformer';

describe('prefillTransformer', () => {
  it('should transform minimal prefill data correctly', () => {
    const minPrefillData = {};
    const result = prefillTransformer({}, minPrefillData, {}).formData;
    expect(result).to.not.be.null;
  });
});
