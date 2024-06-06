import { expect } from 'chai';
import { submissionForm } from './fixtures/data/form-submission-test-data';
import { transformTOEForm } from '../utils/form-submit-transform';

let mockSubmissionForm = {};
let submissionObject = {};
describe('form submit transform', () => {
  beforeEach(() => {
    mockSubmissionForm = JSON.parse(JSON.stringify(submissionForm));
    submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
  });
  describe('has transformTOEForm method', () => {
    describe('creates a type property', () => {
      it('is set to to ToeSubmission', () => {
        expect(submissionObject['@type']).to.eql('ToeSubmission');
      });
    });
    describe('creates toeClaimant information', () => {
      it('sets up first name', () => {
        expect(submissionObject.toeClaimant.firstName).to.eql('Hector');
      });
      it('sets up middle name', () => {
        expect(submissionObject.toeClaimant.middleName).to.eql('M');
      });
      it('sets up last name', () => {
        expect(submissionObject.toeClaimant.lastName).to.eql('Allen');
      });
      it('sets up suffix name', () => {
        expect(submissionObject.toeClaimant.suffix).to.eql('Sr.');
      });
      it('sets up birth date', () => {
        expect(submissionObject.toeClaimant.dateOfBirth).to.eql('1932-02-05');
      });
      it('sets up notificationMethod for text', () => {
        expect(submissionObject.toeClaimant.notificationMethod).to.eql('TEXT');
      });
      it('sets up notificationMethod for email', () => {
        mockSubmissionForm.data[
          'view:receiveTextMessages'
        ].receiveTextMessages = 'No, just send me email notifications';
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(submissionObject.toeClaimant.notificationMethod).to.eql('EMAIL');
      });
      it('sets up preferredContactMethod', () => {
        expect(submissionObject.toeClaimant.preferredContact).to.eql('Email');
      });
      describe('sets up contact info', () => {
        it('sets up address line 1', () => {
          expect(submissionObject.toeClaimant.contactInfo.addressLine1).to.eql(
            '4000 Wilson Blvd',
          );
        });
        it('sets up address line 2', () => {
          expect(submissionObject.toeClaimant.contactInfo.addressLine2).to.eql(
            'street2',
          );
        });
        it('sets up city', () => {
          expect(submissionObject.toeClaimant.contactInfo.city).to.eql(
            'ARLINGTON',
          );
        });
        it('sets up zipcode', () => {
          expect(submissionObject.toeClaimant.contactInfo.zipcode).to.eql(
            '22203',
          );
        });
        it('sets up email address', () => {
          expect(submissionObject.toeClaimant.contactInfo.emailAddress).to.eql(
            'vets.gov.user+0@gmail.com',
          );
        });
        it('sets up address type to domestic ', () => {
          expect(submissionObject.toeClaimant.contactInfo.addressType).to.eql(
            'DOMESTIC',
          );
        });
        it('sets up address type to military overseas ', () => {
          mockSubmissionForm.data[
            'view:mailingAddress'
          ].livesOnMilitaryBase = true;
          submissionObject = JSON.parse(
            transformTOEForm({}, mockSubmissionForm),
          );
          expect(submissionObject.toeClaimant.contactInfo.addressType).to.eql(
            'MILITARY_OVERSEAS',
          );
        });
        it('sets up mobile phone number', () => {
          expect(
            submissionObject.toeClaimant.contactInfo.mobilePhoneNumber,
          ).to.eql('5125554586');
        });
        it('sets up home phone number', () => {
          expect(
            submissionObject.toeClaimant.contactInfo.homePhoneNumber,
          ).to.eql('5125554585');
        });
        it('sets up country code', () => {
          expect(submissionObject.toeClaimant.contactInfo.countryCode).to.eql(
            'US',
          );
        });
        it('sets up state code', () => {
          expect(submissionObject.toeClaimant.contactInfo.stateCode).to.eql(
            'VA',
          );
        });
      });
    });

    describe('creates Parent or Guardian Signature', () => {
      it('sets up parentOrGuardianSignature', () => {
        expect(submissionObject.parentOrGuardianSignature).to.eql(
          'John Hancock',
        );
      });
    });
    describe('creates sponsor options', () => {
      it('sets up firstSponsorVaId if already set', () => {
        expect(submissionObject.sponsorOptions.firstSponsorVaId).to.eql(
          '9001001080',
        );
      });
      it('sets up firstSponsorVaId if firstSponsor is undefined and there is a single selectedSponsor', () => {
        mockSubmissionForm.data.firstSponsor = undefined;
        mockSubmissionForm.data.selectedSponsors = ['90010010981'];
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(submissionObject.sponsorOptions.firstSponsorVaId).to.eql(
          '90010010981',
        );
      });
      it('sets firstSponsorVaId to null if firstSponsor is undefined and there is a more than one selectedSponsor', () => {
        mockSubmissionForm.data.firstSponsor = undefined;
        mockSubmissionForm.data.selectedSponsors = [
          '90010010981',
          '90010010982',
        ];
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(submissionObject.sponsorOptions.firstSponsorVaId).to.eql(null);
      });
      it('sets up notSureAboutSponsor', () => {
        mockSubmissionForm.data.firstSponsor = 'IM_NOT_SURE';
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(submissionObject.sponsorOptions.notSureAboutSponsor).to.eql(
          true,
        );
        expect(submissionObject.sponsorOptions.manualSponsor).to.eql(null);
        expect(submissionObject.sponsorOptions.firstSponsorVaId).to.eql(null);
      });
      describe('creates manual sponsor', () => {
        it('sets to null if firstSponsorVaId present', () => {
          expect(submissionObject.sponsorOptions.manualSponsor).to.eql(null);
        });

        describe('sets manual sponsor object if firstSponsorVaId is not defined', () => {
          beforeEach(() => {
            mockSubmissionForm.data.firstSponsor = undefined;
            submissionObject = JSON.parse(
              transformTOEForm({}, mockSubmissionForm),
            );
          });
          it('sets up firstName', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.firstName,
            ).to.eql('Marga');
          });
          it('sets up middleName', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.middleName,
            ).to.eql('E');
          });
          it('sets up lastName', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.lastName,
              'Spencer',
            );
          });
          it('sets up suffix', () => {
            expect(submissionObject.sponsorOptions.manualSponsor.suffix).to.eql(
              'Jr.',
            );
          });
          it('sets up date of birth', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.dateOfBirth,
            ).to.eql('1990-02-03');
          });
          it('sets up relationship', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.relationship,
            ).to.eql('Spouse');
          });
        });
        describe('sets manual sponsor object if firstSponsorVaId is not SPONSOR_NOT_LISTED', () => {
          beforeEach(() => {
            mockSubmissionForm.data.firstSponsor = 'SPONSOR_NOT_LISTED';
            submissionObject = JSON.parse(
              transformTOEForm({}, mockSubmissionForm),
            );
          });
          it('sets up firstName', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.firstName,
            ).to.eql('Marga');
          });
          it('sets up middleName', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.middleName,
            ).to.eql('E');
          });
          it('sets up lastName', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.lastName,
              'Spencer',
            );
          });
          it('sets up suffix', () => {
            expect(submissionObject.sponsorOptions.manualSponsor.suffix).to.eql(
              'Jr.',
            );
          });
          it('sets up date of birth', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.dateOfBirth,
            ).to.eql('1990-02-03');
          });
          it('sets up relationship', () => {
            expect(
              submissionObject.sponsorOptions.manualSponsor.relationship,
            ).to.eql('Spouse');
          });
        });
      });
    });
    describe('Creates highSchoolDiplomaInfo', () => {
      it('should create high school diploma info with change flag set to true', () => {
        mockSubmissionForm.data = {
          ...mockSubmissionForm.data,
          ...mockSubmissionForm.data.highSchoolDiplomaWithChangeFlagTrue,
        };
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(
          submissionObject.highSchoolDiplomaInfo.highSchoolDiplomaOrCertificate,
        ).to.deep.equal(true);
        expect(
          submissionObject.highSchoolDiplomaInfo
            .highSchoolDiplomaOrCertificateDate,
        ).to.deep.equal('2000-01-02');
      });
      it('should create high school diploma info with change flag set to false', () => {
        mockSubmissionForm.data = {
          ...mockSubmissionForm.data,
          ...mockSubmissionForm.data.highSchoolDiplomaWithChangeFlagFalse,
        };
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(
          submissionObject.highSchoolDiplomaInfo.highSchoolDiplomaOrCertificate,
        ).to.deep.equal(true);
        expect(
          submissionObject.highSchoolDiplomaInfo
            .highSchoolDiplomaOrCertificateDate,
        ).to.deep.equal('2000-01-02');
      });
      it('should set high school diploma certificate to false if No selected and change flag is true', () => {
        mockSubmissionForm.data = {
          ...mockSubmissionForm.data,
          ...mockSubmissionForm.data.noHighSchoolDiplomaWithChangeFlagTrue,
        };
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(
          submissionObject.highSchoolDiplomaInfo.highSchoolDiplomaOrCertificate,
        ).to.deep.equal(false);
      });
      it('should set high school diploma certificate to false if No selected and change flag is false', () => {
        mockSubmissionForm.data = {
          ...mockSubmissionForm.data,
          ...mockSubmissionForm.data.noHighSchoolDiplomaWithChangeFlagFalse,
        };
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(
          submissionObject.highSchoolDiplomaInfo.highSchoolDiplomaOrCertificate,
        ).to.deep.equal(false);
      });
      it('should set high school diploma date to undefined if no date is provided and change flag is true', () => {
        mockSubmissionForm.data = {
          ...mockSubmissionForm.data,
          ...mockSubmissionForm.data.noHighSchoolDiplomaDateWithChangeFlagTrue,
        };
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(
          submissionObject.highSchoolDiplomaInfo
            .highSchoolDiplomaOrCertificateDate,
        ).to.be.undefined;
      });
      it('should set high school diploma date to undefined if no date is provided and change flag is false', () => {
        mockSubmissionForm.data = {
          ...mockSubmissionForm.data,
          ...mockSubmissionForm.data.noHighSchoolDiplomaDateWithChangeFlagFalse,
        };
        submissionObject = JSON.parse(transformTOEForm({}, mockSubmissionForm));
        expect(
          submissionObject.highSchoolDiplomaInfo
            .highSchoolDiplomaOrCertificateDate,
        ).to.be.undefined;
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
        ).to.eql('333333');
      });
      it('sets up direct deposit routing number', () => {
        expect(
          submissionObject.directDeposit.directDepositRoutingNumber,
        ).to.eql('124003116');
      });
    });
  });
});
