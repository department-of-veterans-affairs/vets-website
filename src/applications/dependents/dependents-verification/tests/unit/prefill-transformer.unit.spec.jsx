import { expect } from 'chai';
import prefillTransformer from '../../prefill-transformer';

describe('DV prefill transformer', () => {
  const prefillData = (ssnLastFour = '') => ({
    metadata: { test: 'Test Metadata' },
    formData: { veteranInformation: { ssnLastFour } },
    pages: { testPage: 'Page 1' },
  });

  it('should return built out template from prefill data', () => {
    const { pages, formData, metadata } = prefillData();
    const transformResult = prefillTransformer(pages, formData, metadata);

    expect(transformResult).to.deep.equal(prefillData());
  });

  describe('prefill veteran information', () => {
    it('should transform contact info when present', () => {
      const { pages, formData, metadata } = prefillData('6789');
      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).to.deep.equal(formData);
    });
  });
});
