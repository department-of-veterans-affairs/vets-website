import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from 'platform/forms-system/src/js/helpers';
import transform from '../../config/transform';

describe('transform function', () => {
  let clock;
  let transformForSubmitStub;

  beforeEach(() => {
    const fixedTimestamp = new Date('2025-01-15T00:00:00Z').getTime();
    clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });

    transformForSubmitStub = sinon
      .stub(helpers, 'transformForSubmit')
      .callsFake((config, form) => form.data);
  });

  afterEach(() => {
    clock.restore();
    transformForSubmitStub.restore();
  });

  describe('acknowledgementsTransform', () => {
    it('should add yellowRibbonProgramTerms when agreementType is startNewOpenEndedAgreement', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            fullName: { first: 'John', last: 'Doe' },
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          statement1Initial: 'JD',
          statement2Initial: 'JD',
          statement3Initial: 'JD',
          statement4Initial: 'JD',
          agreementCheckbox: true,
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.yellowRibbonProgramTerms).to.deep.equal({
        firstAcknowledgement: 'JD',
        secondAcknowledgement: 'JD',
        thirdAcknowledgement: 'JD',
        fourthAcknowledgement: 'JD',
        agreeToProvideYellowRibbonProgramContributions: true,
      });
      expect(formData.statement1Initial).to.be.undefined;
      expect(formData.statement2Initial).to.be.undefined;
      expect(formData.statement3Initial).to.be.undefined;
      expect(formData.statement4Initial).to.be.undefined;
      expect(formData.agreementCheckbox).to.be.undefined;
    });

    it('should add yellowRibbonProgramTerms when agreementType is modifyExistingAgreement', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            fullName: { first: 'John', last: 'Doe' },
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'modifyExistingAgreement',
          statement1Initial: 'JD',
          statement2Initial: 'JD',
          statement3Initial: 'JD',
          statement4Initial: 'JD',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.yellowRibbonProgramTerms).to.deep.equal({
        firstAcknowledgement: 'JD',
        secondAcknowledgement: 'JD',
        thirdAcknowledgement: 'JD',
        fourthAcknowledgement: 'JD',
        agreeToProvideYellowRibbonProgramContributions: true,
      });
    });

    it('should not add yellowRibbonProgramTerms when agreementType is withdrawFromYellowRibbonProgram', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'withdrawFromYellowRibbonProgram',
          institutionDetails: { facilityCode: '12345' },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.yellowRibbonProgramTerms).to.be.undefined;
    });
  });

  describe('yellowRibbonProgramRequestTransform', () => {
    it('should transform request with unlimited students and unlimited contribution', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [
            {
              academicYearDisplay: '2024-2025',
              maximumStudentsOption: 'unlimited',
              maximumContributionAmount: 'unlimited',
              collegeOrProfessionalSchool: 'Engineering',
              degreeLevel: 'undergraduate',
            },
          ],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(
        formData.yellowRibbonProgramAgreementRequest[0].maximumNumberofStudents,
      ).to.equal(99999);
      expect(
        formData.yellowRibbonProgramAgreementRequest[0]
          .maximumContributionAmount,
      ).to.equal(99999);
      expect(
        formData.yellowRibbonProgramAgreementRequest[0].currencyType,
      ).to.equal('USD');
      expect(
        formData.yellowRibbonProgramAgreementRequest[0].yearRange,
      ).to.deep.equal({
        from: '2024-XX-XX',
        to: '2025-XX-XX',
      });
      expect(
        formData.yellowRibbonProgramAgreementRequest[0].eligibleIndividuals,
      ).to.equal(1000000);
    });

    it('should transform request with specific students and contribution amounts', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: false },
          yellowRibbonProgramRequest: [
            {
              academicYear: '2023-2024',
              maximumStudentsOption: 'specific',
              maximumStudents: '50',
              maximumContributionAmount: 'specific',
              specificContributionAmount: '5000',
              schoolCurrency: 'EUR',
              collegeOrProfessionalSchool: 'Business',
              degreeLevel: 'graduate',
            },
          ],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(
        formData.yellowRibbonProgramAgreementRequest[0].maximumNumberofStudents,
      ).to.equal(50);
      expect(
        formData.yellowRibbonProgramAgreementRequest[0]
          .maximumContributionAmount,
      ).to.equal(5000);
      expect(
        formData.yellowRibbonProgramAgreementRequest[0].currencyType,
      ).to.equal('EUR');
      expect(
        formData.yellowRibbonProgramAgreementRequest[0].yearRange,
      ).to.deep.equal({
        from: '2023-XX-XX',
        to: '2024-XX-XX',
      });
    });

    it('should use academicYear when academicYearDisplay is not present', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [
            {
              academicYear: '2025-2026',
              maximumStudentsOption: 'specific',
              maximumStudents: '100',
              maximumContributionAmount: 'specific',
              specificContributionAmount: '10000',
              collegeOrProfessionalSchool: 'Medicine',
            },
          ],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(
        formData.yellowRibbonProgramAgreementRequest[0].yearRange,
      ).to.deep.equal({
        from: '2025-XX-XX',
        to: '2026-XX-XX',
      });
    });
  });

  describe('institutionDetailsTransform', () => {
    it('should create withdrawFromYellowRibbonProgram array when agreementType is withdrawFromYellowRibbonProgram', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'withdrawFromYellowRibbonProgram',
          institutionDetails: {
            facilityCode: '12345',
            facilityMap: {},
            ihlEligible: true,
            yrEligible: true,
            isLoading: false,
            isUsaSchool: true,
            isForeignSchool: false,
            name: 'Test School',
          },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.withdrawFromYellowRibbonProgram).to.be.an('array');
      expect(formData.withdrawFromYellowRibbonProgram[0].facilityCode).to.equal(
        '12345',
      );
      expect(formData.withdrawFromYellowRibbonProgram[0].name).to.equal(
        'Test School',
      );
      expect(formData.withdrawFromYellowRibbonProgram[0].facilityMap).to.be
        .undefined;
      expect(formData.institutionDetails).to.be.undefined;
    });

    it('should include additionalInstitutionDetails in withdrawFromYellowRibbonProgram array', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'withdrawFromYellowRibbonProgram',
          institutionDetails: {
            facilityCode: '12345',
            name: 'School 1',
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '67890',
              name: 'School 2',
            },
          ],
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.withdrawFromYellowRibbonProgram).to.have.length(2);
      expect(formData.withdrawFromYellowRibbonProgram[0].facilityCode).to.equal(
        '12345',
      );
      expect(formData.withdrawFromYellowRibbonProgram[1].facilityCode).to.equal(
        '67890',
      );
    });

    it('should create institutionDetails array when agreementType is not withdrawFromYellowRibbonProgram', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: {
            facilityCode: '12345',
            name: 'Test School',
          },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.institutionDetails).to.be.an('array');
      expect(formData.institutionDetails[0].facilityCode).to.equal('12345');
      expect(formData.withdrawFromYellowRibbonProgram).to.be.undefined;
    });

    it('should include additionalInstitutionDetails in institutionDetails array', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'modifyExistingAgreement',
          institutionDetails: {
            facilityCode: '12345',
            name: 'School 1',
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '67890',
              name: 'School 2',
            },
          ],
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.institutionDetails).to.have.length(2);
      expect(formData.institutionDetails[0].facilityCode).to.equal('12345');
      expect(formData.institutionDetails[1].facilityCode).to.equal('67890');
    });
  });

  describe('pointOfContactTransform', () => {
    it('should transform pointsOfContact when all three roles are selected', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
          pointsOfContact: {
            fullName: { first: 'John', last: 'Doe' },
            phoneNumber: { callingCode: '1', contact: '5551234567' },
            email: 'john@example.com',
            roles: {
              isYellowRibbonProgramPointOfContact: true,
              isSchoolCertifyingOfficial: true,
              isSchoolFinancialRepresentative: true,
            },
          },
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.pointOfContact).to.exist;
      expect(formData.pointOfContact.role).to.equal('YellowRibbonProgramPOC');
      expect(formData.pointOfContact.phoneNumber).to.equal('15551234567');
      expect(formData.pointOfContact.emailAddress).to.equal('john@example.com');
      expect(formData.pointOfContactTwo).to.exist;
      expect(formData.pointOfContactTwo.role).to.equal(
        'schoolCertifyingOfficial',
      );
      expect(formData.pointsOfContact).to.be.undefined;
    });

    it('should transform pointsOfContact with additionalPointsOfContact', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
          pointsOfContact: {
            fullName: { first: 'John', last: 'Doe' },
            phoneNumber: { callingCode: '1', contact: '5551234567' },
            email: 'john@example.com',
            roles: {
              isYellowRibbonProgramPointOfContact: true,
              isSchoolCertifyingOfficial: false,
              isSchoolFinancialRepresentative: false,
            },
          },
          additionalPointsOfContact: {
            fullName: { first: 'Jane', last: 'Smith' },
            phoneNumber: { callingCode: '1', contact: '5559876543' },
            email: 'jane@example.com',
          },
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.pointOfContact).to.exist;
      expect(formData.pointOfContact.role).to.equal('YellowRibbonProgramPOC');
      expect(formData.pointOfContactTwo).to.exist;
      expect(formData.pointOfContactTwo.role).to.equal(
        'schoolCertifyingOfficial',
      );
      expect(formData.pointOfContactTwo.emailAddress).to.equal(
        'jane@example.com',
      );
      expect(formData.additionalPointsOfContact).to.be.undefined;
    });

    it('should handle case when pointsOfContact does not exist', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.pointOfContact).to.be.undefined;
    });
  });

  describe('authorizedOfficialTransform', () => {
    it('should transform phoneNumber to contact value', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.authorizedOfficial.phoneNumber).to.equal('5551234567');
    });
  });

  describe('dateTransform', () => {
    it('should add dateSigned field', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.dateSigned).to.exist;
      expect(formData.dateSigned).to.be.a('string');
    });
  });

  describe('statementTransform', () => {
    it('should delete statementOfTruthCertified', () => {
      const formConfig = {};
      const form = {
        data: {
          authorizedOfficial: {
            phoneNumber: { contact: '5551234567' },
          },
          agreementType: 'startNewOpenEndedAgreement',
          institutionDetails: { isUsaSchool: true },
          yellowRibbonProgramRequest: [],
          statementOfTruthCertified: true,
        },
      };

      const result = transform(formConfig, form);
      const parsed = JSON.parse(result);
      const formData = parsed.educationBenefitsClaim.form;

      expect(formData.statementOfTruthCertified).to.be.undefined;
    });
  });
});
