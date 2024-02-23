import { expect } from 'chai';
import { submissionForm } from '../fixtures/data/form-submission-test-data';
import {
  createDirectDeposit,
  createAdditionalConsiderations,
  createComments,
  createContactInfo,
  createMilitaryClaimant,
  createSubmissionForm,
  createRelinquishedBenefit,
  getAddressType,
  getLTSCountryCode,
  getSchemaCountryCode,
  getNotificationMethod,
} from '../../utils/form-submit-transform';

let mockSubmissionForm = {};
describe('form submit transform', () => {
  beforeEach(() => {
    mockSubmissionForm = JSON.parse(JSON.stringify(submissionForm));
  });

  describe('has a createSubmissionForm  method', () => {
    it('creates a submission form out of the entered form data', () => {
      const createdSubmissionForm = createSubmissionForm(mockSubmissionForm);
      // Check the military claimant section
      expect(createdSubmissionForm.claimant.claimantId).to.eql(
        '1000000000000246',
      );
      expect(createdSubmissionForm.claimant.suffix).to.eql('Sr.');
      expect(createdSubmissionForm.claimant.dateOfBirth).to.eql('1989-11-11');
      expect(createdSubmissionForm.claimant.firstName).to.eql('ANDREA');
      expect(createdSubmissionForm.claimant.lastName).to.eql('MITCHELL');
      expect(createdSubmissionForm.claimant.middleName).to.eql('L');
      expect(createdSubmissionForm.claimant.notificationMethod).to.eql('TEXT');
      expect(createdSubmissionForm.claimant.preferredContact).to.eql('Email');

      expect(createdSubmissionForm.claimant.contactInfo.addressLine1).to.eql(
        '1493 Martin Luther King Rd',
      );
      expect(createdSubmissionForm.claimant.contactInfo.addressLine2).to.eql(
        'Apt 1',
      );
      expect(createdSubmissionForm.claimant.contactInfo.city).to.eql('Austin');
      expect(createdSubmissionForm.claimant.contactInfo.zipcode).to.eql(
        '00662',
      );
      expect(createdSubmissionForm.claimant.contactInfo.emailAddress).to.eql(
        'myemail@gmail.com',
      );
      expect(createdSubmissionForm.claimant.contactInfo.addressType).to.eql(
        'DOMESTIC',
      );
      expect(
        createdSubmissionForm.claimant.contactInfo.mobilePhoneNumber,
      ).to.eql('5035551234');
      expect(createdSubmissionForm.claimant.contactInfo.homePhoneNumber).to.eql(
        '5032222222',
      );
      expect(createdSubmissionForm.claimant.contactInfo.countryCode).to.eql(
        'US',
      );
      expect(createdSubmissionForm.claimant.contactInfo.stateCode).to.eql('NY');

      // Check the relinquishments section
      expect(
        createdSubmissionForm.relinquishedBenefit.relinquishedBenefit,
      ).to.eql('CannotRelinquish');
      expect(
        createdSubmissionForm.relinquishedBenefit.effRelinquishDate,
      ).to.eql('2021-02-02');

      // check Additional Considerations section
      expect(
        createdSubmissionForm.additionalConsiderations.activeDutyDodRepayLoan,
      ).to.eql('NO');
      expect(
        createdSubmissionForm.additionalConsiderations.seniorRotcScholarship,
      ).to.eql('YES');
      expect(
        createdSubmissionForm.additionalConsiderations.academyRotcScholarship,
      ).to.eql('YES');
      expect(
        createdSubmissionForm.additionalConsiderations.activeDutyKicker,
      ).to.eql('YES');
      expect(
        createdSubmissionForm.additionalConsiderations.reserveKicker,
      ).to.eql('NO');

      // check comments section
      const todayDate = new Date();
      const todayDateInYYYYmmddFormat = todayDate.toISOString().slice(0, 10);
      expect(createdSubmissionForm.comments.disagreeWithServicePeriod).to.eql(
        true,
      );
      expect(createdSubmissionForm.comments.claimantComment.commentDate).to.eql(
        todayDateInYYYYmmddFormat,
      );
      expect(createdSubmissionForm.comments.claimantComment.comments).to.eql(
        'Service periods are missing.',
      );
    });
  });

  describe('has a createMilitaryClaimant method', () => {
    it('should construct the contact Info object', () => {
      const militaryClaimant = createMilitaryClaimant(mockSubmissionForm);

      expect(militaryClaimant.claimantId).to.eql('1000000000000246');
      expect(militaryClaimant.suffix).to.eql('Sr.');
      expect(militaryClaimant.dateOfBirth).to.eql('1989-11-11');
      expect(militaryClaimant.firstName).to.eql('ANDREA');
      expect(militaryClaimant.lastName).to.eql('MITCHELL');
      expect(militaryClaimant.middleName).to.eql('L');
      expect(militaryClaimant.notificationMethod).to.eql('TEXT');
      expect(militaryClaimant.preferredContact).to.eql('Email');

      expect(militaryClaimant.contactInfo.addressLine1).to.eql(
        '1493 Martin Luther King Rd',
      );
      expect(militaryClaimant.contactInfo.addressLine2).to.eql('Apt 1');
      expect(militaryClaimant.contactInfo.city).to.eql('Austin');
      expect(militaryClaimant.contactInfo.zipcode).to.eql('00662');
      expect(militaryClaimant.contactInfo.emailAddress).to.eql(
        'myemail@gmail.com',
      );
      expect(militaryClaimant.contactInfo.addressType).to.eql('DOMESTIC');
      expect(militaryClaimant.contactInfo.mobilePhoneNumber).to.eql(
        '5035551234',
      );
      expect(militaryClaimant.contactInfo.homePhoneNumber).to.eql('5032222222');
      expect(militaryClaimant.contactInfo.countryCode).to.eql('US');
      expect(militaryClaimant.contactInfo.stateCode).to.eql('NY');
    });
  });

  describe('has a contact information creation method', () => {
    it('should construct the contact Info object', () => {
      const contactInfo = createContactInfo(mockSubmissionForm);
      expect(contactInfo.addressLine1).to.eql('1493 Martin Luther King Rd');
      expect(contactInfo.addressLine2).to.eql('Apt 1');
      expect(contactInfo.city).to.eql('Austin');
      expect(contactInfo.zipcode).to.eql('00662');
      expect(contactInfo.emailAddress).to.eql('myemail@gmail.com');
      expect(contactInfo.addressType).to.eql('DOMESTIC');
      expect(contactInfo.mobilePhoneNumber).to.eql('5035551234');
      expect(contactInfo.homePhoneNumber).to.eql('5032222222');
      expect(contactInfo.countryCode).to.eql('US');
      expect(contactInfo.stateCode).to.eql('NY');
    });
  });

  describe('has a getAddressType method', () => {
    it('should set addressType to DOMESTIC if country code USA', () => {
      mockSubmissionForm['view:mailingAddress'].address.country = 'USA';
      const addressType = getAddressType(
        mockSubmissionForm['view:mailingAddress'],
      );
      expect(addressType).to.eql('DOMESTIC');
    });
    it('should set addressType to FOREIGN if country code not USA', () => {
      mockSubmissionForm['view:mailingAddress'].address.country = 'AFG';
      const addressType = getAddressType(
        mockSubmissionForm['view:mailingAddress'],
      );
      expect(addressType).to.eql('FOREIGN');
    });
    it('should set addressType to MILITARY_OVERSEAS if livesOnMilitaryBase is true', () => {
      mockSubmissionForm['view:mailingAddress'].livesOnMilitaryBase = true;
      const addressType = getAddressType(
        mockSubmissionForm['view:mailingAddress'],
      );
      expect(addressType).to.eql('MILITARY_OVERSEAS');
    });
  });
  describe('has a getLTSCountryCode method', () => {
    it('should return an LTS code for a valid country', () => {
      const ltsCountryCode = getLTSCountryCode('TUN');
      expect(ltsCountryCode).to.eql('TS');
    });
    it('should return unknown code of ZZ for unknown country code', () => {
      const ltsCountryCode = getLTSCountryCode('INVALID_COUNTRY');
      expect(ltsCountryCode).to.eql('ZZ');
    });
  });
  describe('has a getSchemaCountryCode method', () => {
    it('should return a schema code for a valid country', () => {
      const schemaCountryCode = getSchemaCountryCode('TS');
      expect(schemaCountryCode).to.eql('TUN');
    });
    it('the country is set to USA when there is no country code', () => {
      const countryWhenUndefined = getSchemaCountryCode(undefined);
      expect(countryWhenUndefined).to.eql('USA');
    });
    it('the country is set to USA when there is an invalid/unknown country code', () => {
      const countryWhenZZ = getSchemaCountryCode('ZZ'); // ZZ is LTS for 'unknown'
      expect(countryWhenZZ).to.eql('USA');
    });
    it("but don't overide countries when we do get a value", () => {
      const countryWhenUndefined = getSchemaCountryCode('GM');
      expect(countryWhenUndefined).to.eql('DEU');
    });
  });

  describe('has a getNotificationMethod method', () => {
    it('should return "EMAIL" for "No, just send me email notifications" value', () => {
      const notificationMethod = getNotificationMethod(
        'No, just send me email notifications',
      );
      expect(notificationMethod).to.eql('EMAIL');
    });
    it('should return "TEXT" for "Yes, send me text message notifications" value', () => {
      const notificationMethod = getNotificationMethod(
        'Yes, send me text message notifications',
      );
      expect(notificationMethod).to.eql('TEXT');
    });
    it('should return "NONE" for no value', () => {
      const notificationMethod = getNotificationMethod();
      expect(notificationMethod).to.eql('NONE');
    });
  });

  describe('createRelinquishedBenefit', () => {
    it('returns an empty object when submissionForm is null', () => {
      expect(createRelinquishedBenefit(null)).to.eql({});
    });
    it('returns an empty object when submissionForm does not have viewBenefitSelection', () => {
      const form = {}; // Redefine with a more specific or unique name if needed
      expect(createRelinquishedBenefit(form)).to.eql({});
    });
    it('returns the correct object when a benefit is relinquished with an effective date', () => {
      const formWithDate = {
        'view:benefitSelection': {
          benefitRelinquished: 'Chapter30',
        },
        benefitEffectiveDate: '2023-01-01',
      };
      expect(createRelinquishedBenefit(formWithDate)).to.eql({
        relinquishedBenefit: 'Chapter30',
        effRelinquishDate: '2023-01-01',
      });
    });
    it('returns NotEligible when benefitRelinquished is not present', () => {
      const formNotEligible = {
        'view:benefitSelection': {},
      };
      expect(createRelinquishedBenefit(formNotEligible)).to.deep.equal({
        relinquishedBenefit: 'NotEligible',
      });
    });
  });

  describe('has a createAdditionalConsiderations method', () => {
    it('should return capitalized "YES" and "NO" for present questions', () => {
      const additionalConsiderations = createAdditionalConsiderations(
        mockSubmissionForm,
      );
      expect(additionalConsiderations.activeDutyDodRepayLoan).to.eql('NO');
      expect(additionalConsiderations.seniorRotcScholarship).to.eql('YES');
      expect(additionalConsiderations.academyRotcScholarship).to.eql('YES');
      expect(additionalConsiderations.activeDutyKicker).to.eql('YES');
      expect(additionalConsiderations.reserveKicker).to.eql('NO');
    });
    it('should return "NA" for additional consideration flag not present', () => {
      mockSubmissionForm.selectedReserveKicker = undefined;
      const additionalConsiderations = createAdditionalConsiderations(
        mockSubmissionForm,
      );
      expect(additionalConsiderations.reserveKicker).to.eql('N/A');
    });
  });

  describe('createAdditionalConsiderations', () => {
    it('should correctly transform and set considerations with exclusion messages', () => {
      const ExclusionPeriodsFormSubmission = {
        mebExclusionPeriodEnabled: true,
        exclusionPeriods: ['Academy', 'ROTC', 'LRP'], // Make sure 'LRP' is included
        federallySponsoredAcademy: 'yes',
        seniorRotcCommission: 'no',
        loanPayment: 'yes',
        activeDutyKicker: 'no',
        selectedReserveKicker: 'yes',
      };
      const transformed = createAdditionalConsiderations(
        ExclusionPeriodsFormSubmission,
      );
      expect(transformed).to.deep.equal({
        academyRotcScholarship:
          'YES - Dept. of Defense data shows you have graduated from a Military Service Academy',
        seniorRotcScholarship:
          'NO - Dept. of Defense data shows you were commissioned as the result of a Senior ROTC.',
        activeDutyDodRepayLoan:
          'YES - Dept. of Defense data shows a period of active duty that the military considers as being used for purposes of repaying an Education Loan.',
        activeDutyKicker: 'NO',
        reserveKicker: 'YES',
      });
    });
    it('should handle cases without mebExclusionPeriodEnabled', () => {
      const NoExclusionPeriodsFormSubmission = {
        federallySponsoredAcademy: 'no',
        seniorRotcCommission: 'yes',
        loanPayment: 'no',
        activeDutyKicker: 'yes',
        selectedReserveKicker: 'no',
      };
      const transformed = createAdditionalConsiderations(
        NoExclusionPeriodsFormSubmission,
      );
      expect(transformed).to.deep.equal({
        academyRotcScholarship: 'NO',
        seniorRotcScholarship: 'YES',
        activeDutyDodRepayLoan: 'NO',
        activeDutyKicker: 'YES',
        reserveKicker: 'NO',
      });
    });
  });
  describe('has a createComments method', () => {
    it('should return full comments section if veteran disagrees with period data', () => {
      const comments = createComments(mockSubmissionForm);
      const todayDate = new Date();
      const todayDateInYYYYmmddFormat = todayDate.toISOString().slice(0, 10);
      expect(comments.disagreeWithServicePeriod).to.eql(true);
      expect(comments.claimantComment.commentDate).to.eql(
        todayDateInYYYYmmddFormat,
      );
      expect(comments.claimantComment.comments).to.eql(
        'Service periods are missing.',
      );
    });
    it('should return empty comments section if veteran disagrees with period data but no comments found', () => {
      mockSubmissionForm.incorrectServiceHistoryExplanation = undefined;
      const comments = createComments(mockSubmissionForm);
      const objectIsEmpty = Object.keys(comments.claimantComment).length === 0;
      expect(objectIsEmpty).to.eql(true);
      expect(comments.disagreeWithServicePeriod).to.eql(true);
    });
    it(
      'should return an empty comment section and disagreeWithServicePeriod set to false' +
        ' if veteran agrees with period data',
      () => {
        mockSubmissionForm[
          'view:serviceHistory'
        ].serviceHistoryIncorrect = undefined;
        const comments = createComments(mockSubmissionForm);
        const objectIsEmpty =
          Object.keys(comments.claimantComment).length === 0;
        expect(objectIsEmpty).to.eql(true);
        expect(comments.disagreeWithServicePeriod).to.eql(false);
      },
    );
  });
  describe('has a bank account capture method', () => {
    it('should return with users bank savings account number, if they decide to enroll', () => {
      const bankAccount = createDirectDeposit(mockSubmissionForm);
      expect(bankAccount.directDepositAccountType).to.eql('Savings');
    });
    describe('createDirectDeposit function', () => {
      it('extracts bank account info when available directly in submissionForm', () => {
        mockSubmissionForm.bankAccount = {
          accountType: 'Savings',
          accountNumber: '123456',
          routingNumber: '322271627',
        };

        const result = createDirectDeposit(mockSubmissionForm);

        expect(result.directDepositAccountType).to.eql('Savings');
        expect(result.directDepositAccountNumber).to.eql('123456');
        expect(result.directDepositRoutingNumber).to.eql('322271627');
      });
      it('extracts bank account info from view:directDeposit in submissionForm', () => {
        mockSubmissionForm['view:directDeposit'] = {
          bankAccount: {
            accountType: 'Checking',
            accountNumber: '654321',
            routingNumber: '123456789',
          },
        };
        mockSubmissionForm.bankAccount = {}; // Ensuring direct bankAccount is empty

        const result = createDirectDeposit(mockSubmissionForm);

        expect(result.directDepositAccountType).to.eql('Checking');
        expect(result.directDepositAccountNumber).to.eql('654321');
        expect(result.directDepositRoutingNumber).to.eql('123456789');
      });
      it('returns empty object when bank account info is not available', () => {
        mockSubmissionForm['view:directDeposit'] = {};
        mockSubmissionForm.bankAccount = {};

        const result = createDirectDeposit(mockSubmissionForm);

        expect(result).to.eql({});
      });
      it('handles invalid or incomplete bank account info', () => {
        // Setup with incomplete bank account info
        mockSubmissionForm.bankAccount = {
          accountType: 'Savings',
          // Missing accountNumber and routingNumber
        };
        const result = createDirectDeposit(mockSubmissionForm);
        expect(result).to.eql({});
      });
    });
  });
});
