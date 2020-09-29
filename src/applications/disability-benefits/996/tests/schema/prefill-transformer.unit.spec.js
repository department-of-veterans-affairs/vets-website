import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

// This is the nesting of the prefill data; transformation flattens it
const buildData = ({
  street = '',
  street2 = '',
  street3 = '',
  city = '',
  state = '',
  country = '',
  zipCode5 = '',
  emailAddress = '',
  phoneNumber = '',
  ssnLastFour = '',
  vaFileLastFour = '',
}) => ({
  prefill: {
    data: {
      attributes: {
        veteran: {
          address: {
            zipCode5,
          },
          phone: {
            phoneNumber,
          },
          emailAddressText: emailAddress,
        },
      },
    },
    nonPrefill: {
      veteranAddress: {
        street,
        street2,
        street3,
        city,
        state,
        country,
      },
      veteranSsnLastFour: ssnLastFour,
      veteranVaFileNumberLastFour: vaFileLastFour,
    },
  },
  result: {
    veteran: {
      street,
      street2,
      street3,
      city,
      state,
      country,
      zipCode5,
      phoneNumber,
      emailAddress,
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

  describe('prefill veteran information', () => {
    it('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        phoneNumber: '1123123123',
        emailAddress: 'a@b.c',
        country: 'USA',
        street: '123 Any Street',
        city: 'Anyville',
        state: 'AK',
        zipCode5: '12345',
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
    });

    it('should transform partial contact info', () => {
      const { pages, metadata } = noTransformData;
      const emailAddress = 'a@b.c';
      const data = buildData({ emailAddress });

      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
    });
  });
});
