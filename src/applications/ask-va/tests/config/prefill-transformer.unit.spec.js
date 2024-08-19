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
