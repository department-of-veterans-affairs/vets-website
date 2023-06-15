import { expect } from 'chai';

import {
  didEnrollmentStatusChange,
  expensesLessThanIncome,
  transformAttachments,
  prefillTransformer,
  isShortFormEligible,
  includeSpousalInformation,
  getInsuranceAriaLabel,
  isOfCollegeAge,
  getDependentPageList,
} from '../../utils/helpers';
import { HIGH_DISABILITY_MINIMUM } from '../../utils/constants';

describe('hca helpers', () => {
  // NOTE: for household v1 only -- remove when v2 is fully-adopted
  describe('expensesLessThanIncome', () => {
    it('should return true if expenses less than income', () => {
      const formData = {
        veteranNetIncome: 3,
        deductibleMedicalExpenses: 2,
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should return false if expenses greater than income', () => {
      const formData = {
        veteranNetIncome: 3,
        deductibleMedicalExpenses: 4,
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should include income from dependents', () => {
      const formData = {
        deductibleMedicalExpenses: 2,
        dependents: [
          {
            grossIncome: 3,
          },
        ],
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should include spouse income', () => {
      const formData = {
        deductibleMedicalExpenses: 2,
        'view:spouseIncome': {
          spouseGrossIncome: 3,
        },
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should show only if last non-zero expense amount', () => {
      const formData = {
        dependents: [
          {
            grossIncome: 3,
          },
        ],
        deductibleEducationExpenses: 0,
        deductibleFuneralExpenses: 0,
        deductibleMedicalExpenses: 4,
      };

      expect(expensesLessThanIncome('deductibleMedicalExpenses')(formData)).to
        .be.false;
      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
      expect(expensesLessThanIncome('deductibleFuneralExpenses')(formData)).to
        .be.true;
    });
    it('should show warning just under last field if all expenses are filled', () => {
      const formData = {
        dependents: [
          {
            grossIncome: 3,
          },
        ],
        deductibleEducationExpenses: 4,
        deductibleFuneralExpenses: 4,
        deductibleMedicalExpenses: 4,
      };

      expect(expensesLessThanIncome('deductibleMedicalExpenses')(formData)).to
        .be.true;
      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.false;
      expect(expensesLessThanIncome('deductibleFuneralExpenses')(formData)).to
        .be.true;
    });
  });

  describe('transformAttachments', () => {
    it('should do nothing if there are no attachments to transform', () => {
      const inputData = { firstName: 'Pat' };
      const transformedData = transformAttachments(inputData);
      expect(transformedData).to.deep.equal(inputData);
    });
    it('should transform `attachmentId`s to `dd214` booleans', () => {
      const inputData = {
        firstName: 'Pat',
        attachments: [
          {
            name: 'file1',
            size: 1,
            confirmationCode: 'uuid123',
            attachmentId: '1',
          },
          {
            name: 'file2',
            size: 1,
            confirmationCode: 'uuid456',
            attachmentId: '2',
          },
        ],
      };
      const expectedOutputData = {
        firstName: 'Pat',
        attachments: [
          {
            name: 'file1',
            size: 1,
            confirmationCode: 'uuid123',
            dd214: true,
          },
          {
            name: 'file2',
            size: 1,
            confirmationCode: 'uuid456',
            dd214: false,
          },
        ],
      };
      const transformedData = transformAttachments(inputData);
      expect(transformedData).to.deep.equal(expectedOutputData);
    });
  });

  describe('didEnrollmentStatusChange', () => {
    const defaultProps = {
      enrollmentStatus: null,
      noESRRecordFound: false,
      shouldRedirect: false,
    };
    let prevProps;
    let newProps;
    it('returns `false` if none of the relevant props have changed', () => {
      prevProps = { ...defaultProps };
      newProps = { ...defaultProps };
      expect(didEnrollmentStatusChange(prevProps, newProps)).to.equal(false);
    });
    it('returns `true` if `enrollmentStatus` changed', () => {
      prevProps = { ...defaultProps };
      newProps = { ...defaultProps, enrollmentStatus: 'enrolled' };
      expect(didEnrollmentStatusChange(prevProps, newProps)).to.equal(true);
    });
    it('returns `true` if `noESRRecordFound` changed', () => {
      prevProps = { ...defaultProps };
      newProps = { ...defaultProps, noESRRecordFound: true };
      expect(didEnrollmentStatusChange(prevProps, newProps)).to.equal(true);
    });
    it('returns `true` if `shouldRedirect` changed', () => {
      prevProps = { ...defaultProps };
      newProps = { ...defaultProps, shouldRedirect: true };
      expect(didEnrollmentStatusChange(prevProps, newProps)).to.equal(true);
    });
  });

  describe('isShortFormEligible', () => {
    const formData = {
      vaCompensationType: 'none',
      'view:totalDisabilityRating': 0,
    };
    it('returns `false` if disability rating is too low, and compensation type is not `highDisability`', () => {
      expect(isShortFormEligible(formData)).to.equal(false);
    });
    it('returns `true` if disability rating is too low, but compensation type is `highDisability`', () => {
      expect(
        isShortFormEligible({
          ...formData,
          vaCompensationType: 'highDisability',
        }),
      ).to.equal(true);
    });
    it('returns `true` if disability rating is greater or equal to the high disability minimum', () => {
      expect(
        isShortFormEligible({
          ...formData,
          'view:totalDisabilityRating': HIGH_DISABILITY_MINIMUM,
        }),
      ).to.equal(true);
    });
  });

  describe('includeSpousalInformation', () => {
    const formData = {
      discloseFinancialInformation: false,
      maritalStatus: 'never married',
    };
    it('returns `false` if user chooses not to disclose their financial information', () => {
      expect(includeSpousalInformation(formData)).to.equal(false);
    });
    it('returns `false` if user chooses to disclose their financial information, but is not married', () => {
      expect(
        includeSpousalInformation({
          ...formData,
          discloseFinancialInformation: true,
        }),
      ).to.equal(false);
    });
    it('returns `true` if user chooses to disclose their financial information and is legally married', () => {
      expect(
        includeSpousalInformation({
          ...formData,
          discloseFinancialInformation: true,
          maritalStatus: 'married',
        }),
      ).to.equal(true);
    });
    it('returns `true` if user chooses to disclose their financial information and is legally married, but separated', () => {
      expect(
        includeSpousalInformation({
          ...formData,
          discloseFinancialInformation: true,
          maritalStatus: 'separated',
        }),
      ).to.equal(true);
    });
  });

  describe('getInsuranceAriaLabel', () => {
    it('returns a generic label if the provider name is not provided', () => {
      const formData = {};
      expect(getInsuranceAriaLabel(formData)).to.equal('insurance policy');
    });
    it('returns the provider name with the policy number when provided', () => {
      const formData = {
        insuranceName: 'Aetna',
        insurancePolicyNumber: '005588',
      };
      expect(getInsuranceAriaLabel(formData)).to.equal(
        'Aetna, Policy number 005588',
      );
    });
    it('returns the provider name with the group code when provided', () => {
      const formData = {
        insuranceName: 'Aetna',
        insuranceGroupCode: '005588',
      };
      expect(getInsuranceAriaLabel(formData)).to.equal(
        'Aetna, Group code 005588',
      );
    });
  });

  describe('isOfCollegeAge', () => {
    it('returns `false` if birthdate is greater than 23 years from testdate', () => {
      const birthdate = '1986-06-01';
      const testdate = '2023-06-01';
      expect(isOfCollegeAge(birthdate, testdate)).to.equal(false);
    });
    it('returns `false` if birthdate is less than 18 years from testdate', () => {
      const birthdate = '2005-06-02';
      const testdate = '2023-06-01';
      expect(isOfCollegeAge(birthdate, testdate)).to.equal(false);
    });
    it('returns `true` if birthdate is exactly 18 years from testdate', () => {
      const birthdate = '2005-06-01';
      const testdate = '2023-06-01';
      expect(isOfCollegeAge(birthdate, testdate)).to.equal(true);
    });
    it('returns `true` if birthdate is exactly 23 years from testdate', () => {
      const birthdate = '2000-06-01';
      const testdate = '2023-06-01';
      expect(isOfCollegeAge(birthdate, testdate)).to.equal(true);
    });
    it('returns `true` if birthdate is between 18 and 23 years from testdate', () => {
      const birthdate = '2003-06-01';
      const testdate = '2023-06-01';
      expect(isOfCollegeAge(birthdate, testdate)).to.equal(true);
    });
  });

  describe('getDependentPageList', () => {
    const subpages = [
      { id: 'page1', title: 'Page 1' },
      { id: 'page2', title: 'Page 2', depends: { key: 'key1', value: false } },
      { id: 'page3', title: 'Page 3' },
      { id: 'page4', title: 'Page 4', depends: { key: 'key2', value: true } },
      { id: 'page5', title: 'Page 5', depends: { key: 'key3', value: false } },
    ];
    it('returns a list of the two (2) pages that do not have a conditional dependency', () => {
      const formData = {};
      expect(getDependentPageList(subpages, formData)).to.have.lengthOf(2);
    });
    it('returns a list of four (3) pages when one conditional dependency does not match', () => {
      const formData = { key1: true, key2: true, key3: true };
      expect(getDependentPageList(subpages, formData)).to.have.lengthOf(3);
    });
    it('returns a list of four (4) pages when one conditional dependency does not match', () => {
      const formData = { key1: false, key2: true, key3: true };
      expect(getDependentPageList(subpages, formData)).to.have.lengthOf(4);
    });
    it('returns a list of all pages when the conditional dependencies match', () => {
      const formData = { key1: false, key2: true, key3: false };
      expect(getDependentPageList(subpages, formData)).to.have.lengthOf(5);
    });
  });

  it('prefillTransformer should auto-fill formData from user state', () => {
    const formData = {
      veteranFullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
      gender: 'M',
      veteranDateOfBirth: '1933-05-04',
      veteranSocialSecurityNumber: '796121200',
      homePhone: '4445551212',
      email: 'test2@test1.net',
      lastServiceBranch: 'air force',
      lastEntryDate: '2001-03-21',
      postNov111998Combat: true,
      lastDischargeDate: '2014-07-21',
      dischargeType: 'honorable',
      vaCompensationType: 'lowDisability',
      'view:demographicCategories': { isSpanishHispanicLatino: false },
    };

    const state = {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress: {
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
            },
            mailingAddress: {
              addressLine1: '1493 Martin Luther King Rd',
              addressLine2: 'Apt 1',
              addressLine3: null,
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
            },
          },
        },
      },
    };

    const prefillData = prefillTransformer(null, formData, null, state)
      .formData;

    // should have autofill length
    expect(Object.keys(prefillData).length).to.equal(16);
    // should have autofill residential address length
    expect(Object.keys(prefillData.veteranAddress).length).to.equal(7);
    // should have autofill mailing if exist address length
    expect(Object.keys(prefillData.veteranHomeAddress).length).to.equal(7);
    // if addresses match check whether they do or not
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(false);
  });

  it('prefillTransformer should auto-fill formData from user state', () => {
    const formData = {
      veteranFullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
      gender: 'M',
      veteranDateOfBirth: '1933-05-04',
      veteranSocialSecurityNumber: '796121200',
      homePhone: '4445551212',
      email: 'test2@test1.net',
      lastServiceBranch: 'air force',
      lastEntryDate: '2001-03-21',
      postNov111998Combat: true,
      lastDischargeDate: '2014-07-21',
      dischargeType: 'honorable',
      vaCompensationType: 'lowDisability',
      'view:demographicCategories': { isSpanishHispanicLatino: false },
    };

    const state = {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress: {
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
            },
          },
        },
      },
    };

    const prefillData = prefillTransformer(null, formData, null, state)
      .formData;

    // should have autofill length
    expect(Object.keys(prefillData).length).to.equal(15);
    // should have autofill residential address length
    expect(prefillData.veteranAddress).to.equal(undefined);
    // should have autofill mailing if exist address length
    expect(Object.keys(prefillData.veteranHomeAddress).length).to.equal(7);
    // if addresses match check whether they do or not
    expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(undefined);
  });
});
