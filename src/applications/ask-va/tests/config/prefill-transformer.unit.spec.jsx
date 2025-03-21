import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

const buildFormData = (
  first = '',
  last = '',
  serviceNumber = undefined,
  ssn = undefined,
  phoneNumber = '',
  emailAddress = '',
  schoolInfo = {},
  branchOfService = '',
) => {
  const payload = {
    personalInformation: {
      first,
      last,
      ...(serviceNumber && { serviceNumber }),
      ...(ssn && { socialSecurityNumber: ssn }),
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
      ...(serviceNumber || ssn
        ? {
            socialOrServiceNum: {
              ...(serviceNumber && { serviceNumber }),
              ...(ssn && { ssn }),
            },
          }
        : {}),
      branchOfService,
    },
    phoneNumber: phoneNumber || '',
    emailAddress: emailAddress || '',
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
      undefined,
      '123456987',
      '555-123-4567',
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
      },
      pages,
    });
  });

  it('should handle empty strings and undefined values consistently', () => {
    const formData = buildFormData('', '', '', '', '', '', {}, '');

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

  it('should only include socialOrServiceNum when values are present', () => {
    // Test with only service number
    const withServiceNumber = buildFormData('John', 'Doe', '12345', undefined);
    const transformedServiceNumber = prefillTransformer(
      pages,
      withServiceNumber.payload,
      metadata,
    );
    expect(
      transformedServiceNumber.formData.aboutYourself.socialOrServiceNum,
    ).to.deep.equal({
      serviceNumber: '12345',
    });

    // Test with only SSN
    const withSSN = buildFormData('John', 'Doe', undefined, '987654321');
    const transformedSSN = prefillTransformer(pages, withSSN.payload, metadata);
    expect(
      transformedSSN.formData.aboutYourself.socialOrServiceNum,
    ).to.deep.equal({
      ssn: '987654321',
    });

    // Test with neither
    const withNeither = buildFormData('John', 'Doe');
    const transformedNeither = prefillTransformer(
      pages,
      withNeither.payload,
      metadata,
    );
    expect(transformedNeither.formData.aboutYourself.socialOrServiceNum).to.be
      .undefined;
  });
});
