import { expect } from 'chai';
import { submissionForm } from './fixtures/data/form-submission-test-data';
import {
  createContactInfo,
  createMilitaryClaimant,
  getAddressType,
  getLTSCountryCode,
  getNotificationMethod,
  getPreferredContact,
} from '../utils/form-submit-transform';

let mockSubmissionForm = {};
describe('form submit transform', () => {
  beforeEach(() => {
    mockSubmissionForm = JSON.parse(JSON.stringify(submissionForm));
  });

  describe('has a military claimant information creation method', () => {
    it('should construct the contact Info object', () => {
      const militaryClaimant = createMilitaryClaimant(mockSubmissionForm);

      expect(militaryClaimant.claimant.claimantId).to.eql(0); // TODO need to figure out how this will get set.
      expect(militaryClaimant.claimant.suffix).to.eql('Sr.');
      expect(militaryClaimant.claimant.dateOfBirth).to.eql('1989-11-11');
      expect(militaryClaimant.claimant.firstName).to.eql('ANDREA');
      expect(militaryClaimant.claimant.lastName).to.eql('MITCHELL');
      expect(militaryClaimant.claimant.middleName).to.eql('L');
      expect(militaryClaimant.claimant.notificationMethod).to.eql(
        'mobileTextMessage',
      );
      expect(militaryClaimant.claimant.preferredContact).to.eql('email');

      expect(militaryClaimant.claimant.contactInfo.addressLine1).to.eql(
        '1493 Martin Luther King Rd',
      );
      expect(militaryClaimant.claimant.contactInfo.addressLine2).to.eql(
        'Apt 1',
      );
      expect(militaryClaimant.claimant.contactInfo.city).to.eql('Austin');
      expect(militaryClaimant.claimant.contactInfo.effectiveDate).to.eql(
        '2021-02-02',
      );
      expect(militaryClaimant.claimant.contactInfo.zipcode).to.eql('00662');
      expect(militaryClaimant.claimant.contactInfo.zipCodeExtension).to.eql('');
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
      expect(contactInfo.effectiveDate).to.eql('2021-02-02');
      expect(contactInfo.zipcode).to.eql('00662');
      expect(contactInfo.zipCodeExtension).to.eql('');
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

  describe('has a getPreferredContact method', () => {
    it('should return "email" for "Email" value', () => {
      const preferredContact = getPreferredContact('Email');
      expect(preferredContact).to.eql('email');
    });
    it('should return "mail" for "Mail" value', () => {
      const preferredContact = getPreferredContact('Mail');
      expect(preferredContact).to.eql('mail');
    });
    it('should return "mobileTextMessage" for "Mobile phone" value', () => {
      const preferredContact = getPreferredContact('Mobile phone');
      expect(preferredContact).to.eql('mobileTextMessage');
    });
    it('should return "homePhone" for "Home phone" value', () => {
      const preferredContact = getPreferredContact('Home phone');
      expect(preferredContact).to.eql('homePhone');
    });
    it('should return "" for undefined value', () => {
      const preferredContact = getPreferredContact();
      expect(preferredContact).to.eql('');
    });
  });
  describe('has a getNotificationMethod method', () => {
    it('should return "email" for "No, just send me email notifications" value', () => {
      const notificationMethod = getNotificationMethod(
        'No, just send me email notifications',
      );
      expect(notificationMethod).to.eql('email');
    });
    it('should return "mobileTextMessage" for "Yes, send me text message notifications" value', () => {
      const notificationMethod = getNotificationMethod(
        'Yes, send me text message notifications',
      );
      expect(notificationMethod).to.eql('mobileTextMessage');
    });
    it('should return "" for no value', () => {
      const notificationMethod = getNotificationMethod();
      expect(notificationMethod).to.eql('');
    });
  });
});
