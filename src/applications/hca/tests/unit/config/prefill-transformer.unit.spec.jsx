import { expect } from 'chai';
import { prefillTransformer } from '../../../config/prefill-transformer';

describe('hca `prefillTransformer` utility', () => {
  const defaultPrefillData = {
    veteranFullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
    gender: 'M',
    veteranDateOfBirth: '1933-05-04',
    veteranSocialSecurityNumber: '796121200',
    homePhone: '4445551212',
    mobilePhone: '4445551212',
    email: 'test2@test1.net',
    lastServiceBranch: 'air force',
    lastEntryDate: '2001-03-21',
    lastDischargeDate: '2014-07-21',
    dischargeType: 'honorable',
    postNov111998Combat: true,
    vaCompensationType: 'lowDisability',
    'view:demographicCategories': { isSpanishHispanicLatino: false },
  };

  const getData = ({
    residentialAddress = null,
    mailingAddress = null,
    status = null,
    loggedIn = false,
    prefillData = defaultPrefillData,
  } = {}) => {
    const state = {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress,
            mailingAddress,
          },
          status,
        },
        login: {
          currentlyLoggedIn: loggedIn,
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
    const prefillData = getData();
    expect(Object.keys(prefillData)).to.have.lengthOf(16);
    expect(prefillData.veteranAddress).to.not.exist;
    expect(prefillData.veteranHomeAddress).to.not.exist;
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(undefined);
  });

  it('should return correct form data when user record is located in MPI', () => {
    const prefillData = getData({ status: 'OK' });
    expect(Object.keys(prefillData)).to.have.lengthOf(17);
    expect(prefillData['view:isUserInMvi']).to.be.true;
  });

  it('should return correct form data when profile data omits mailing address', () => {
    const prefillData = getData({ residentialAddress });
    expect(Object.keys(prefillData)).to.have.lengthOf(17);
    expect(prefillData.veteranHomeAddress).to.exist;
    expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(7);
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(undefined);
  });

  it('should return correct form data when profile data includes mailing address that does not match residential address', () => {
    const prefillData = getData({ residentialAddress, mailingAddress });
    expect(Object.keys(prefillData)).to.have.lengthOf(18);
    expect(prefillData.veteranAddress).to.exist;
    expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(7);
    expect(prefillData.veteranHomeAddress).to.exist;
    expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(7);
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.false;
  });

  it('should return correct form data when profile data includes mailing address that matches residential address', () => {
    const prefillData = getData({
      residentialAddress,
      mailingAddress: residentialAddress,
    });
    expect(Object.keys(prefillData)).to.have.lengthOf(17);
    expect(prefillData.veteranHomeAddress).to.not.exist;
    expect(prefillData.veteranAddress).to.exist;
    expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(7);
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.true;
  });

  context('prefills valid veteranDateOfBirth', () => {
    it('should return correct form data when profile data includes valid veteranDateOfBirth', () => {
      const prefillData = getData({});
      expect(Object.keys(prefillData)).to.have.lengthOf(16);
      expect(prefillData.veteranDateOfBirth).to.equal(
        defaultPrefillData.veteranDateOfBirth,
      );
    });

    it('should return correct form data when profile data omits veteranDateOfBirth entirely', () => {
      /* eslint-disable no-unused-vars */
      const {
        veteranDateOfBirth,
        ...prefillDataWithoutDateOfBirth
      } = defaultPrefillData;
      /* eslint-enable no-unused-vars */

      const prefillData = getData({
        prefillData: prefillDataWithoutDateOfBirth,
      });
      expect(Object.keys(prefillData)).to.have.lengthOf(15);
      expect(prefillData.veteranDateOfBirth).to.not.exist;
    });

    it('should return correct form data when profile data includes invalid veteranDateOfBirth', () => {
      const prefillData = getData({
        prefillData: {
          ...defaultPrefillData,
          veteranDateOfBirth: '1880-05-04',
        },
      });
      expect(Object.keys(prefillData)).to.have.lengthOf(16);
      expect(prefillData.veteranDateOfBirth).to.not.exist;
    });
  });

  context('prefills valid phone numbers', () => {
    it('should return correct form data when profile data includes valid USA phone numbers', () => {
      const prefillData = getData({});
      expect(Object.keys(prefillData)).to.have.lengthOf(16);
      expect(prefillData.homePhone).to.equal(defaultPrefillData.homePhone);
      expect(prefillData.mobilePhone).to.equal(defaultPrefillData.mobilePhone);
    });

    it('should return correct form data when profile data includes international phone numbers', () => {
      const prefillData = getData({
        prefillData: {
          ...defaultPrefillData,
          homePhone: '442012345678',
          mobilePhone: '416123-4567',
        },
      });
      expect(Object.keys(prefillData)).to.have.lengthOf(16);
      expect(prefillData.homePhone).to.not.exist;
      expect(prefillData.mobilePhone).to.not.exist;
    });

    it('should return correct form data when profile data omits homePhone entirely', () => {
      /* eslint-disable no-unused-vars */
      const { homePhone, ...prefillDataWithoutHomePhone } = defaultPrefillData;
      /* eslint-enable no-unused-vars */

      const prefillData = getData({
        prefillData: prefillDataWithoutHomePhone,
      });
      expect(Object.keys(prefillData)).to.have.lengthOf(15);
      expect(prefillData.homePhone).to.not.exist;
    });
  });

  context('sets login state', () => {
    it('should set view:isLoggedIn to true when user is logged in', () => {
      const prefillData = getData({ loggedIn: true });
      expect(prefillData['view:isLoggedIn']).to.be.true;
    });

    it('should set view:isLoggedIn to false when user is not logged in', () => {
      const prefillData = getData({ loggedIn: false });
      expect(prefillData['view:isLoggedIn']).to.be.false;
    });

    it('should set view:isLoggedIn even when no other prefill data exists', () => {
      const prefillData = getData({
        loggedIn: true,
        prefillData: {},
      });
      expect(prefillData['view:isLoggedIn']).to.be.true;
      expect(Object.keys(prefillData)).to.include('view:isLoggedIn');
    });
  });
});
