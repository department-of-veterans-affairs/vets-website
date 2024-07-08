import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

const buildData = ({
  first = '',
  last = '',
  phoneNumber = '',
  emailAddress = '',
  schoolInfo = '',
}) => ({
  prefill: {
    personalInformation: {
      first,
      last,
    },
    contactInformation: {
      phoneNumber,
      emailAddress,
    },
    avaProfile: {
      schoolInfo,
    },
  },
  result: {
    aboutYourself: {
      first,
      last,
    },
    phoneNumber,
    emailAddress,
    school: schoolInfo,
  },
});

describe('Ask VA prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {},
    pages: { testPage: 'Page 1' },
  };

  it('should transform user information when present', () => {
    const { pages, metadata } = noTransformData;
    const data = buildData({
      first: 'Peter',
      last: 'Parker',
      phoneNumber: '555-123-4567',
      emailAddress: 'pparker@dailyBugle.com',
      schoolInfo: 'Midtown School of Science',
    });
    const transformedData = prefillTransformer(pages, data.prefill, metadata);

    expect(transformedData).to.deep.equal({
      pages,
      formData: data.result,
      metadata,
    });
  });
});
