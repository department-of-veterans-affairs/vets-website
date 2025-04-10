import { expect } from 'chai';
import { prefillTransformer } from '../../config/prefill-transformer';
/*
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

 */

describe('SC prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: 'This is not getting transformed',
      data: {},
    },
    pages: { testPage: 'Page 1' },
    state: {
      user: {
        profile: {
          edipi: '123456789',
          icn: '111222333',
        },
      },
    },
  };

  it('should return built out template from prefill data', () => {
    const { pages, formData, metadata, state } = noTransformData;
    const noTransformActual = prefillTransformer(
      pages,
      formData,
      metadata,
      state,
    );
    expect(noTransformActual).to.not.equal(noTransformData);
  });

  /*
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
  }); */
});
