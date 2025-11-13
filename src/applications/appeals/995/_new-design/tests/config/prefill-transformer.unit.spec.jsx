import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

// This is the nesting of the prefill data; transformation flattens it
const buildData = ({ ssnLastFour = '', vaFileLastFour = '' }) => ({
  prefill: {
    veteranSsnLastFour: ssnLastFour,
    veteranVaFileNumberLastFour: vaFileLastFour,
  },
  result: {
    veteran: {
      ssnLastFour,
      vaFileLastFour,
    },
  },
});

describe('SC prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: 'This is not getting transformed',
      data: {},
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

  it('should return empty prefills with no data', () => {
    const { pages, metadata } = noTransformData;
    const noTransformActual = prefillTransformer(pages, null, metadata);
    expect(noTransformActual).to.deep.equal({
      metadata: noTransformData.metadata,
      formData: buildData({}).result,
      pages: noTransformData.pages,
    });
  });

  it('should transform ssn & vafn when present', () => {
    const { pages, metadata } = noTransformData;
    const data = buildData({
      ssnLastFour: '9876',
      vaFileLastFour: '7654',
    });
    const transformedData = prefillTransformer(pages, data.prefill, metadata);

    expect(transformedData).to.deep.equal({
      pages,
      formData: data.result,
      metadata,
    });
  });
});
