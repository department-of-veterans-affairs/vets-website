import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

// This is the nesting of the prefill data; transformation flattens it
const buildData = veteran => ({
  data: {
    attributes: {
      veteran,
    },
  },
});

describe('HLR prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: 'This is not getting transformed',
      data: {},
    },
    pages: { testPage: 'Page 1' },
  };

  it('should return a copy of the prefill data', () => {
    const { pages, formData, metadata } = noTransformData;
    const noTransformActual = prefillTransformer(pages, formData, metadata);
    // ensure transformed data is not the same object as input data
    expect(noTransformActual).to.not.equal(noTransformData);
    expect(noTransformActual).to.deep.equal({
      metadata: noTransformData.metadata,
      formData: { veteran: {} },
      pages: noTransformData.pages,
    });
  });

  describe('prefill veteran information', () => {
    it('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = buildData({
        phoneNumber: '1123123123',
        emailAddress: 'a@b.c',
        countryCode: 'USA',
        addressLine1: '123 Any Street',
        city: 'Anyville',
        stateOrProvineCode: 'AK',
        zipPostalCode: '12345',
      });

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).to.deep.equal({
        veteran: formData.data.attributes.veteran,
      });
    });

    it('should transform partial contact info', () => {
      const { pages, metadata } = noTransformData;
      const emailAddress = 'a@b.c';
      const formData = buildData({ emailAddress });

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).to.deep.equal({
        veteran: { emailAddress },
      });
    });
  });
});
