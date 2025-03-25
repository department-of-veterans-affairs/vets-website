import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

<<<<<<< HEAD
const buildData = ({
  first = '',
  last = '',
  phoneNumber = '',
  emailAddress = '',
  schoolInfo = '',
  branchOfService = '',
}) => ({
  prefill: {
    personalInformation: {
      first,
      last,
    },
    contactInformation: {
      phoneNumber,
      emailAddress,
=======
const buildFormData = (
  first = '',
  last = '',
  serviceNumber = undefined,
  ssn = undefined,
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
      ...(serviceNumber && { serviceNumber }),
      ...(ssn && { socialSecurityNumber: ssn }),
    },
    contactInformation: {
      phone: phoneNumber,
      email: emailAddress,
>>>>>>> main
    },
    avaProfile: {
      schoolInfo,
    },
    veteranServiceInformation: {
      branchOfService,
    },
<<<<<<< HEAD
  },
  result: {
    aboutYourself: {
      branchOfService: 'Army',
      dateOfBirth: '1999-08-16',
      first: 'Jason',
      last: 'Todd',
      socialOrServiceNum: {
        ssn: '123456987',
      },
      suffix: 'Jr.',
    },
    address: {
      city: 'Gotham',
      postalCode: '86360',
      state: 'IL',
      street: '49119 Wayne Manor',
      street2: '',
      street3: '',
      unitNumber: '',
    },
    businessEmail: 'fake@company.com',
    businessPhone: '1234567890',
    emailAddress: 'j.todd@redhood.com',
    phoneNumber: '4445551212',
    preferredName: 'Robin',
    school: {
      schoolFacilityCode: '12345678',
      schoolName: 'Fake School',
    },
  },
  // Changing to work with mock data in prefill transformer
  // result: {
  //   aboutYourself: {
  //     first,
  //     last,
  //   },
  //   phoneNumber,
  //   emailAddress,
  //   school: schoolInfo,
  // },
});

describe('Ask VA prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {},
    pages: { testPage: 'Page 1' },
  };

  xit('should transform user information when present', () => {
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
=======
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
      undefined,
      '123456987',
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
>>>>>>> main
});
