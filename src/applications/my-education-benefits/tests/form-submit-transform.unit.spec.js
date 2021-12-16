import { expect } from 'chai';
import { submissionForm } from './fixtures/data/form-submission-test-data';
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
} from '../utils/form-submit-transform';

let mockSubmissionForm = {};
describe('form submit transform', () => {
  beforeEach(() => {
    mockSubmissionForm = JSON.parse(JSON.stringify(submissionForm));
  });

  describe('has a createSubmissionForm  method', () => {
    it('creates a submission form out of the entered form data', () => {
      const createdSubmissionForm = createSubmissionForm(mockSubmissionForm);

      // Check the military claimant section
      expect(createdSubmissionForm.militaryClaimant.claimant.claimantId).to.eql(
        '1000000000000246',
      );
      expect(createdSubmissionForm.militaryClaimant.claimant.suffix).to.eql(
        'Sr.',
      );
      expect(
        createdSubmissionForm.militaryClaimant.claimant.dateOfBirth,
      ).to.eql('1989-11-11');
      expect(createdSubmissionForm.militaryClaimant.claimant.firstName).to.eql(
        'ANDREA',
      );
      expect(createdSubmissionForm.militaryClaimant.claimant.lastName).to.eql(
        'MITCHELL',
      );
      expect(createdSubmissionForm.militaryClaimant.claimant.middleName).to.eql(
        'L',
      );
      expect(
        createdSubmissionForm.militaryClaimant.claimant.notificationMethod,
      ).to.eql('TEXT');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.preferredContact,
      ).to.eql('Email');

      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo
          .addressLine1,
      ).to.eql('1493 Martin Luther King Rd');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo
          .addressLine2,
      ).to.eql('Apt 1');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo.city,
      ).to.eql('Austin');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo.zipcode,
      ).to.eql('00662');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo
          .emailAddress,
      ).to.eql('myemail@gmail.com');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo.addressType,
      ).to.eql('DOMESTIC');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo
          .mobilePhoneNumber,
      ).to.eql('5035551234');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo
          .homePhoneNumber,
      ).to.eql('5032222222');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo.countryCode,
      ).to.eql('US');
      expect(
        createdSubmissionForm.militaryClaimant.claimant.contactInfo.stateCode,
      ).to.eql('NY');

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

      expect(militaryClaimant.claimant.claimantId).to.eql('1000000000000246');
      expect(militaryClaimant.claimant.suffix).to.eql('Sr.');
      expect(militaryClaimant.claimant.dateOfBirth).to.eql('1989-11-11');
      expect(militaryClaimant.claimant.firstName).to.eql('ANDREA');
      expect(militaryClaimant.claimant.lastName).to.eql('MITCHELL');
      expect(militaryClaimant.claimant.middleName).to.eql('L');
      expect(militaryClaimant.claimant.notificationMethod).to.eql('TEXT');
      expect(militaryClaimant.claimant.preferredContact).to.eql('Email');

      expect(militaryClaimant.claimant.contactInfo.addressLine1).to.eql(
        '1493 Martin Luther King Rd',
      );
      expect(militaryClaimant.claimant.contactInfo.addressLine2).to.eql(
        'Apt 1',
      );
      expect(militaryClaimant.claimant.contactInfo.city).to.eql('Austin');
      expect(militaryClaimant.claimant.contactInfo.zipcode).to.eql('00662');
      expect(militaryClaimant.claimant.contactInfo.emailAddress).to.eql(
        'myemail@gmail.com',
      );
      expect(militaryClaimant.claimant.contactInfo.addressType).to.eql(
        'DOMESTIC',
      );
      expect(militaryClaimant.claimant.contactInfo.mobilePhoneNumber).to.eql(
        '5035551234',
      );
      expect(militaryClaimant.claimant.contactInfo.homePhoneNumber).to.eql(
        '5032222222',
      );
      expect(militaryClaimant.claimant.contactInfo.countryCode).to.eql('US');
      expect(militaryClaimant.claimant.contactInfo.stateCode).to.eql('NY');
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
    it('should set addressType to MILITARY_OVERSEAS if livesOnMilitaryBase is true AND country is not USA', () => {
      mockSubmissionForm['view:mailingAddress'].livesOnMilitaryBase = true;
      mockSubmissionForm['view:mailingAddress'].address.country = 'AFG';
      const addressType = getAddressType(
        mockSubmissionForm['view:mailingAddress'],
      );
      expect(addressType).to.eql('MILITARY_OVERSEAS');
    });
    it('should set addressType to DOMESTIC if livesOnMilitaryBase is true AND country is USA', () => {
      mockSubmissionForm['view:mailingAddress'].livesOnMilitaryBase = true;
      mockSubmissionForm['view:mailingAddress'].address.country = 'USA';
      const addressType = getAddressType(
        mockSubmissionForm['view:mailingAddress'],
      );
      expect(addressType).to.eql('DOMESTIC');
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
    it('should return undefined for an unknown country code', () => {
      const schemaCountryCode = getSchemaCountryCode('INVALID_COUNTRY');
      expect(schemaCountryCode).to.eql(undefined);
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

  describe('has a createRelinquishedBenefit method', () => {
    it('should return a relinquished benefit object if relinquishment present', () => {
      const relinquishedBenefit = createRelinquishedBenefit(mockSubmissionForm);
      expect(relinquishedBenefit.relinquishedBenefit).to.eql(
        'CannotRelinquish',
      );
      expect(relinquishedBenefit.effRelinquishDate).to.eql('2021-02-02');
    });
    it('should return empty object if no relinquishment', () => {
      mockSubmissionForm['view:benefitSelection'] = undefined;
      const relinquishedBenefit = createRelinquishedBenefit(mockSubmissionForm);
      const objectIsEmpty = Object.keys(relinquishedBenefit).length === 0;
      expect(objectIsEmpty).to.eql(true);
    });

    it('should return empty object if no relinquishment', () => {
      mockSubmissionForm[
        'view:benefitSelection'
      ].benefitRelinquished = undefined;
      const relinquishedBenefit = createRelinquishedBenefit(mockSubmissionForm);
      const objectIsEmpty = Object.keys(relinquishedBenefit).length === 0;
      expect(objectIsEmpty).to.eql(true);
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
      expect(bankAccount.accountType).to.eql('Savings');
    });
  });
});
