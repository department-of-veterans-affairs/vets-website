import { expect } from 'chai';
import { submissionForm } from '../fixtures/data/form-submission-test-data';
import { transform5490Form } from '../../utils/form-submit-transform';

let mockSubmissionForm = {};
let submissionObject = {};
describe('form submit transform', () => {
  beforeEach(() => {
    mockSubmissionForm = JSON.parse(JSON.stringify(submissionForm));
    submissionObject = JSON.parse(transform5490Form({}, mockSubmissionForm));
  });
  describe('has transform5490Form method', () => {
    describe('creates a type property', () => {
      it('is set to to Chapter', () => {
        expect(submissionObject['@type']).to.eql('Chapter35Submission');
      });
    });
    describe('creates claimant information', () => {
      it('sets up first name', () => {
        expect(submissionObject.claimant.firstName).to.eql('Hector');
      });
      it('sets up middle name', () => {
        expect(submissionObject.claimant.middleName).to.eql('M');
      });
      it('sets up last name', () => {
        expect(submissionObject.claimant.lastName).to.eql('Allen');
      });
      it('sets up suffix name', () => {
        expect(submissionObject.claimant.suffix).to.eql('Sr.');
      });
      it('sets up birth date', () => {
        expect(submissionObject.claimant.dateOfBirth).to.eql('1932-02-05');
      });
      it('sets up notificationMethod for text', () => {
        mockSubmissionForm.data.notificationMethod = 'yes';
        submissionObject = JSON.parse(
          transform5490Form({}, mockSubmissionForm),
        );
        expect(submissionObject.claimant.notificationMethod).to.eql('TEXT');
      });
      it('sets up notificationMethod for email', () => {
        expect(submissionObject.claimant.notificationMethod).to.eql('EMAIL');
      });
      it('sets up preferredContactMethod', () => {
        expect(submissionObject.claimant.preferredContact).to.eql('Email');
      });

      describe('sets up contact info', () => {
        it('sets up address line 1', () => {
          expect(submissionObject.claimant.contactInfo.addressLine1).to.eql(
            '4000 Wilson Blvd',
          );
        });
        it('sets up address line 2', () => {
          expect(submissionObject.claimant.contactInfo.addressLine2).to.eql(
            '#1',
          );
        });
        it('sets up city', () => {
          expect(submissionObject.claimant.contactInfo.city).to.eql(
            'ARLINGTON',
          );
        });
        it('sets up zipcode', () => {
          expect(submissionObject.claimant.contactInfo.zipcode).to.eql('22203');
        });
        it('sets up email address', () => {
          expect(submissionObject.claimant.contactInfo.emailAddress).to.eql(
            'test@test.com',
          );
        });
        it('sets up address type to domestic ', () => {
          expect(submissionObject.claimant.contactInfo.addressType).to.eql(
            'DOMESTIC',
          );
        });
        it('sets up address type to military overseas ', () => {
          const form = {
            data: {
              mailingAddressInput: {
                livesOnMilitaryBase: 'true',
              },
            },
          };
          submissionObject = JSON.parse(transform5490Form({}, form));
          expect(submissionObject.claimant.contactInfo.addressType).to.eql(
            'MILITARY_OVERSEAS',
          );
        });
        it('sets up mobile phone number', () => {
          expect(
            submissionObject.claimant.contactInfo.mobilePhoneNumber,
          ).to.eql('5125554586');
        });
        it('sets up home phone number', () => {
          expect(submissionObject.claimant.contactInfo.homePhoneNumber).to.eql(
            '5125554585',
          );
        });
        it('sets up country code', () => {
          expect(submissionObject.claimant.contactInfo.countryCode).to.eql(
            'US',
          );
        });
        it('sets up state code', () => {
          expect(submissionObject.claimant.contactInfo.stateCode).to.eql('VA');
        });
      });
    });

    describe('Creates highSchoolDiplomaInfo', () => {
      it('should capture high school diploma info', () => {
        expect(
          submissionObject.highSchoolDiplomaInfo
            ?.highSchoolDiplomaOrCertificate,
        ).to.eql(true);
        expect(
          submissionObject.highSchoolDiplomaInfo
            ?.highSchoolDiplomaOrCertificateDate,
        ).to.eql('2010-01-02');
      });
    });

    describe('creates service member information', () => {
      it('sets up first name', () => {
        expect(submissionObject.serviceMember.firstName).to.eql('test');
      });
      it('sets up middle name', () => {
        expect(submissionObject.serviceMember.middleName).to.eql('t');
      });
      it('sets up last name', () => {
        expect(submissionObject.serviceMember.lastName).to.eql('testerson');
      });
      it('sets up suffix name', () => {
        expect(submissionObject.serviceMember.relationship).to.eql('spouse');
      });
      it('sets up birth date', () => {
        expect(submissionObject.serviceMember.dateOfBirth).to.eql('1990-01-01');
      });
      it('sets up ssn', () => {
        expect(submissionObject.serviceMember.ssn).to.eql('123123123');
      });
    });

    describe('creates Direct Deposit information', () => {
      it('sets up direct deposit account type', () => {
        expect(submissionObject.directDeposit.directDepositAccountType).to.eql(
          'checking',
        );
      });
      it('sets up direct deposit account number', () => {
        expect(
          submissionObject.directDeposit.directDepositAccountNumber,
        ).to.eql('123123123');
      });
      it('sets up direct deposit routing number', () => {
        expect(
          submissionObject.directDeposit.directDepositRoutingNumber,
        ).to.eql('123123124');
      });
    });

    describe('Creates additionalConsiderations', () => {
      it('sets up outstandingFelony', () => {
        expect(
          submissionObject.additionalConsiderations.outstandingFelony,
        ).to.eql('no');
      });
      it('sets up marriageDate', () => {
        expect(submissionObject.additionalConsiderations.marriageDate).to.eql(
          '2015-01-01',
        );
      });
      it('sets up marriageStatus', () => {
        expect(submissionObject.additionalConsiderations.marriageStatus).to.eql(
          'divorced',
        );
      });
      it('sets up remarriageDate', () => {
        expect(submissionObject.additionalConsiderations.remarriageDate).to.eql(
          '2020-01-01',
        );
      });
      it('sets up remarriedSinceDivorce', () => {
        expect(
          submissionObject.additionalConsiderations.remarriedSinceDivorce,
        ).to.eql('yes');
      });
    });
  });
});
