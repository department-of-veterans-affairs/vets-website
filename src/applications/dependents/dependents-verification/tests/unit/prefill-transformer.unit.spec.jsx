import { expect } from 'chai';
import prefillTransformer from '../../prefill-transformer';

describe('DV prefill transformer', () => {
  const prefillData = (ssnLastFour = '', ssn = '', vaFileNumber = '') => ({
    metadata: { test: 'Test Metadata' },
    formData: { veteranInformation: { ssnLastFour, ssn, vaFileNumber } },
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

    it('should transform contact info when not present', () => {
      const { pages, metadata } = prefillData('6789');
      const expectedFormData = { veteranInformation: { ssnLastFour: '' } };
      const prefillEmptyVetInfo = prefillTransformer(
        pages,
        { veteranInformation: {} },
        metadata,
      ).formData;
      const prefillNoFormData = prefillTransformer(pages, {}, metadata)
        .formData;

      expect(prefillEmptyVetInfo).to.deep.equal(expectedFormData);
      expect(prefillNoFormData).to.deep.equal(expectedFormData);
    });
  });
});
