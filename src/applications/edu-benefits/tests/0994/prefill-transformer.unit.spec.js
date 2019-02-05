import { expect } from 'chai';

import { prefillData, transformedPrefillData } from './schema/prefillData';

import { prefillTransformer } from '../../0994/prefill-transformer';

describe('prefillTransformer', () => {
  it('should transform prefill data correctly', () => {
    expect(prefillTransformer({}, prefillData, {}).formData).to.deep.equal(
      transformedPrefillData,
    );
  });
});
