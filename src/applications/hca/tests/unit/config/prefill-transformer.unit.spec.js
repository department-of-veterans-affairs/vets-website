import { expect } from 'chai';
import { prefillTransformer } from '../../../config/prefill-transformer';

describe('hca `prefillTransformer` utility', () => {
  const getData = ({
    residentialAddress = null,
    mailingAddress = null,
    status = null,
  }) => {
    const prefillData = {
      veteranFullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
      gender: 'M',
      veteranDateOfBirth: '1933-05-04',
      veteranSocialSecurityNumber: '796121200',
      homePhone: '4445551212',
      email: 'test2@test1.net',
      lastServiceBranch: 'air force',
      lastEntryDate: '2001-03-21',
      lastDischargeDate: '2014-07-21',
      dischargeType: 'honorable',
      postNov111998Combat: true,
      vaCompensationType: 'lowDisability',
      'view:demographicCategories': { isSpanishHispanicLatino: false },
    };
    const state = {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress,
            mailingAddress,
          },
          status,
        },
      },
    };
    const { formData } = prefillTransformer([], prefillData, {}, state);
    return formData;
  };
  const residentialAddress = {
    addressLine1: 'PSC 808 Box 37',
    addressLine2: null,
    addressLine3: null,
    addressPou: 'RESIDENCE/CHOICE',
    addressType: 'OVERSEAS MILITARY',
    city: 'FPO',
    countryCodeFips: 'US',
    countryCodeIso2: 'US',
    countryCodeIso3: 'USA',
    countryName: 'United States',
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    id: 124,
    internationalPostalCode: '54321',
    latitude: 37.5615,
    longitude: -121.9988,
    province: 'string',
    sourceDate: '2018-04-21T20:09:50Z',
    stateCode: 'AE',
    updatedAt: '2018-04-21T20:09:50Z',
    zipCode: '09618',
    zipCodeSuffix: '1234',
  };
  const mailingAddress = {
    addressLine1: '1493 Martin Luther King Rd',
    addressLine2: 'Apt 1',
    addressLine3: 'c/o homeowner',
    addressPou: 'CORRESPONDENCE',
    addressType: 'DOMESTIC',
    city: 'Fulton',
    countryName: 'United States',
    countryCodeFips: 'US',
    countryCodeIso2: 'US',
    countryCodeIso3: 'USA',
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    id: 123,
    internationalPostalCode: '54321',
    province: 'string',
    sourceDate: '2018-04-21T20:09:50Z',
    stateCode: 'NY',
    updatedAt: '2018-04-21T20:09:50Z',
    zipCode: '97062',
    zipCodeSuffix: '1234',
  };

  it('should return correct form data when profile data omits all addresses', () => {
    const prefillData = getData({});
    expect(Object.keys(prefillData)).to.have.lengthOf(14);
    expect(Object.keys(prefillData).veteranAddress).to.not.exist;
    expect(Object.keys(prefillData).veteranHomeAddress).to.not.exist;
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(undefined);
  });

  it('should return correct form data when user record is located in MPI', () => {
    const prefillData = getData({ status: 'OK' });
    expect(Object.keys(prefillData)).to.have.lengthOf(15);
    expect(prefillData['view:isUserInMvi']).to.be.true;
  });

  it('should return correct form data when profile data omits mailing address', () => {
    const prefillData = getData({ residentialAddress });
    expect(Object.keys(prefillData)).to.have.lengthOf(15);
    expect(prefillData.veteranAddress).to.equal(undefined);
    expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(7);
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(undefined);
  });

  it('should return correct form data when profile data includes mailing address that does not match residential address', () => {
    const prefillData = getData({ residentialAddress, mailingAddress });
    expect(Object.keys(prefillData)).to.have.lengthOf(16);
    expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(7);
    expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(7);
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.false;
  });

  it('should return correct form data when profile data includes mailing address that matches residential address', () => {
    const prefillData = getData({
      residentialAddress,
      mailingAddress: residentialAddress,
    });
    expect(Object.keys(prefillData)).to.have.lengthOf(15);
    expect(Object.keys(prefillData).veteranHomeAddress).to.not.exist;
    expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(7);
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.true;
  });
});
