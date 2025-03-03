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
  return {
    payload: {
      personalInformation: {
        first,
        last,
        serviceNumber,
        socialSecurityNumber: ssn,
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
    },
    expected: {
      aboutYourself: {
        first,
        last,
        socialOrServiceNum: {
          serviceNumber,
          ssn,
        },
        // ========
        // TODO: Transformer appears to be adding duplicate data?? joehall-tw
        branchOfService,
        serviceNumber,
        socialSecurityNumber: ssn,
        // END TODO
        // ========
      },
      phone: phoneNumber,
      email: emailAddress,
      schoolInfo,
      // ========
      // TODO: Transformer appears to be adding duplicate data?? joehall-tw
      phoneNumber,
      emailAddress,
      // END TODO
      // ========
    },
  };
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
});
