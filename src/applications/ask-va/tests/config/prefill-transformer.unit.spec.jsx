import { expect } from 'chai';

import prefillTransformer from '../../config/prefill-transformer';

const buildFormData = (
  first = '',
  last = '',
  phoneNumber = '',
  businessPhone = '',
  emailAddress = '',
  schoolInfo = {},
  branchOfService = '',
) => {
  const payload = {
    personalInformation: {
      first,
      last,
    },
    contactInformation: {
      phone: phoneNumber,
      email: emailAddress,
    },
    avaProfile: {
      schoolInfo,
    },
    veteranServiceInformation: {
      branchOfService,
    },
  };

  const expected = {
    aboutYourself: {
      first,
      last,
      branchOfService,
    },
    phoneNumber: phoneNumber || '',
    emailAddress: emailAddress || '',
    businessPhone: businessPhone || '',
    businessEmail: emailAddress || '',
    schoolInfo,
  };

  return { payload, expected };
};

describe('Ask VA prefill transformer', () => {
  const metadata = { test: 'Test Metadata' };
  const pages = { testPage: 'Page 1' };

  it('should transform user information when present', () => {
    const formData = buildFormData(
      'Peter',
      'Parker',
      '555-123-4567',
      '',
      'pparker@dailyBugle.com',
      { schoolFacilityCode: '321', schoolName: 'Midtown School of Science' },
    );

    const transformedData = prefillTransformer(
      pages,
      formData.payload,
      metadata,
    );

    expect(transformedData).to.deep.equal({
      metadata,
      formData: formData.expected,
      pages,
    });
  });

  it('should handle missing or null data gracefully', () => {
    const transformedData = prefillTransformer(pages, null, metadata);

    expect(transformedData).to.deep.equal({
      metadata,
      formData: {
        aboutYourself: {},
        phoneNumber: '',
        emailAddress: '',
        businessPhone: '',
        businessEmail: '',
      },
      pages,
    });
  });

  it('should handle partial data with missing sections', () => {
    const partialData = {
      personalInformation: {
        first: 'John',
        last: 'Doe',
      },
      contactInformation: {
        phone: '555-123-4567',
      },
    };

    const transformedData = prefillTransformer(pages, partialData, metadata);

    expect(transformedData).to.deep.equal({
      metadata,
      formData: {
        aboutYourself: {
          first: 'John',
          last: 'Doe',
        },
        phoneNumber: '555-123-4567',
        emailAddress: '',
        businessPhone: '',
        businessEmail: '',
      },
      pages,
    });
  });

  it('should handle empty strings and undefined values consistently', () => {
    const formData = buildFormData('', '', '', '', {}, '');

    const transformedData = prefillTransformer(
      pages,
      formData.payload,
      metadata,
    );

    expect(transformedData).to.deep.equal({
      metadata,
      formData: formData.expected,
      pages,
    });
  });
});
