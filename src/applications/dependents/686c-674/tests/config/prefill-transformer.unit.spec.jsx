import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

const buildData = ({
  ssnLastFour = '',
  vaFileLastFour = '',
  useV2 = true,
  daysTillExpires = 365,
}) => ({
  prefill: {
    data: {},
    nonPrefill: {
      veteranSsnLastFour: ssnLastFour,
      veteranVaFileNumberLastFour: vaFileLastFour,
    },
  },
  result: {
    useV2,
    daysTillExpires,
    veteranInformation: {
      ssnLastFour,
      vaFileLastFour,
    },
  },
});

describe('NOD prefill transformer', () => {
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
