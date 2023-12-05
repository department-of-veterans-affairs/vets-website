import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

// This is the nesting of the prefill data; transformation flattens it
const buildData = ({ ssnLastFour = '', vaFileLastFour = '' }) => ({
  prefill: {
    data: {},
    nonPrefill: {
      veteranSsnLastFour: ssnLastFour,
      veteranVaFileNumberLastFour: vaFileLastFour,
    },
  },
  result: {
    veteran: {
      ssnLastFour,
      vaFileLastFour,
    },
  },
});

describe('HLR prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: 'This is not getting transformed',
      data: {},
      nonPrefill: {},
    },
    pages: { testPage: 'Page 1' },
  };

  it('should return built out template from prefill data', () => {
    const { pages, formData, metadata } = noTransformData;
    const noTransformActual = prefillTransformer(pages, formData, metadata);
    // ensure transformed data is not the same object as input data
    expect(noTransformActual).to.not.equal(noTransformData);
    expect(noTransformActual).to.deep.equal({
      metadata: noTransformData.metadata,
      formData: buildData({}).result,
      pages: noTransformData.pages,
    });
  });

  it('should return built out template from empty non-prefill data', () => {
    const { pages, metadata } = noTransformData;
    const formData = { testData: noTransformData.formData.testData };
    const noTransformActual = prefillTransformer(pages, formData, metadata);
    // ensure transformed data is not the same object as input data
    expect(noTransformActual).to.not.equal(noTransformData);
    expect(noTransformActual).to.deep.equal({
      metadata: noTransformData.metadata,
      formData: buildData({}).result,
      pages: noTransformData.pages,
    });
  });

  describe('prefill veteran information', () => {
    it('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
    });
  });
});
