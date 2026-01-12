import { expect } from 'chai';
import { prefillTransformer } from '../../../config/prefillTransformer';

describe('10-7959c prefill transformer', () => {
  it('should return pages, formData, and metadata', () => {
    const result = prefillTransformer({}, {}, {});
    expect(
      ['pages', 'formData', 'metadata'].every(k =>
        Object.keys(result).includes(k),
      ),
    ).to.be.true;
  });
});
