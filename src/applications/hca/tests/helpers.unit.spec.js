import { expect } from 'chai';

import {
  didEnrollmentStatusChange,
  expensesLessThanIncome,
  getCSTOffset,
  getOffsetTime,
  getAdjustedTime,
  isAfterCentralTimeDate,
  isBeforeCentralTimeDate,
  transformAttachments,
  prefillTransformer,
} from '../helpers.jsx';

describe('HCA helpers', () => {
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
  describe('getCSTOffset', () => {
    it('should return -300 if is daylight savings time', () => {
      expect(getCSTOffset(true)).to.equal(-300);
    });
    it('should return -360 if is not daylight savings time', () => {
      expect(getCSTOffset(false)).to.equal(-360);
    });
  });
  describe('getOffsetTime', () => {
    it('should convert an offset number of minutes into milliseconds', () => {
      expect(getOffsetTime(1)).to.equal(60000);
    });
  });
  describe('getAdjustedTime', () => {
    it('should determine utc time', () => {
      expect(getAdjustedTime(1, 1)).to.equal(2);
    });
  });
  describe('isAfterCentralTimeDate', () => {
    it('should return true if the discharge date is after the Central Time reference date', () => {
      expect(isAfterCentralTimeDate('9999-12-24')).to.be.true;
    });
    it('should return false if the discharge date is not after the Central Time reference date', () => {
      expect(isAfterCentralTimeDate('2000-12-12')).to.be.false;
    });
  });
  describe('isBeforeCentralTimeDate', () => {
    it('should return true if the discharge date is after the Central Time reference date', () => {
      expect(isBeforeCentralTimeDate('9999-12-24')).to.be.false;
    });
    it('should return false if the discharge date is not after the Central Time reference date', () => {
      expect(isBeforeCentralTimeDate('2000-12-12')).to.be.true;
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
