import { expect } from 'chai';
import { submissionForm } from './fixtures/data/form-submission-test-data';
import {
  createContactInfo,
  getAddressType,
  getLTSCountryCode,
} from '../utils/form-submit-transform';

let mockSubmissionForm = {};
describe('form submit transform', () => {
  beforeEach(() => {
    mockSubmissionForm = JSON.parse(JSON.stringify(submissionForm));
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
});
