/**
 * @module tests/config/form.unit.spec
 * @description Unit tests for form configuration
 */

import { expect } from 'chai';
import { formConfig } from './form';

describe('Form Configuration', () => {
  describe('Basic Structure', () => {
    it('should export form config object', () => {
      expect(formConfig).to.be.an('object');
    });

    it('should have form ID', () => {
      expect(formConfig.formId).to.exist;
      expect(formConfig.formId).to.equal('21-0779');
    });

    it('should have title', () => {
      expect(formConfig.title).to.exist;
      expect(formConfig.title).to.include('nursing home');
    });

    it('should have subtitle', () => {
      expect(formConfig.subTitle).to.exist;
      expect(formConfig.subTitle).to.include('21-0779');
    });

    it('should have rootUrl', () => {
      expect(formConfig.rootUrl).to.exist;
      expect(formConfig.rootUrl).to.be.a('string');
    });

    it('should have submitUrl', () => {
      expect(formConfig.submitUrl).to.include('/v0/form210779');
    });
  });

  describe('Form Chapters and Pages', () => {
    it('should have chapters object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });

    it('should have nursingOfficialPersonalChapter', () => {
      expect(formConfig.chapters.nursingOfficialPersonalChapter).to.exist;
      expect(
        formConfig.chapters.nursingOfficialPersonalChapter.title,
      ).to.include('personal');
    });

    it('should have nursingHomeChapter', () => {
      expect(formConfig.chapters.nursingHomeChapter).to.exist;
      expect(formConfig.chapters.nursingHomeChapter.title).to.include(
        'Nursing home',
      );
    });

    it('should have patientInformationChapter', () => {
      expect(formConfig.chapters.patientInformationChapter).to.exist;
      expect(formConfig.chapters.patientInformationChapter.title).to.include(
        'Patient',
      );
    });

    it('should have levelOfCareChapter', () => {
      expect(formConfig.chapters.levelOfCareChapter).to.exist;
      expect(formConfig.chapters.levelOfCareChapter.title).to.include(
        'Level of care',
      );
    });

    it('should have medicaidChapter', () => {
      expect(formConfig.chapters.medicaidChapter).to.exist;
      expect(formConfig.chapters.medicaidChapter.title).to.include('Medicaid');
    });

    it('should have costsChapter', () => {
      expect(formConfig.chapters.costsChapter).to.exist;
      expect(formConfig.chapters.costsChapter.title).to.include('Cost');
    });
  });

  describe('Page Configuration', () => {
    it('should have nursing official information page', () => {
      const page =
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('nursing-official-information');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have nursing home details page', () => {
      const page =
        formConfig.chapters.nursingHomeChapter.pages.nursingHomeDetails;
      expect(page).to.exist;
      expect(page.path).to.equal('nursing-home-details');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have claimant question page', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.claimantQuestion;
      expect(page).to.exist;
      expect(page.path).to.equal('claimant-question');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have claimant personal info page', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      expect(page).to.exist;
      expect(page.path).to.equal('claimant-personal-info');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have veteran personal info page', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.veteranPersonalInfo;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-personal-info');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have certification level of care page', () => {
      const page =
        formConfig.chapters.levelOfCareChapter.pages.certificationLevelOfCare;
      expect(page).to.exist;
      expect(page.path).to.equal('certification-level-of-care');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have admission date page', () => {
      const page = formConfig.chapters.levelOfCareChapter.pages.admissionDate;
      expect(page).to.exist;
      expect(page.path).to.equal('admission-date');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have medicaid facility page', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidFacility;
      expect(page).to.exist;
      expect(page.path).to.equal('medicaid-facility');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have monthly costs page', () => {
      const page = formConfig.chapters.costsChapter.pages.monthlyCosts;
      expect(page).to.exist;
      expect(page.path).to.equal('monthly-costs');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });
  });

  describe('Introduction and Confirmation', () => {
    it('should have introduction page component', () => {
      expect(formConfig.introduction).to.exist;
    });

    it('should have confirmation page component', () => {
      expect(formConfig.confirmation).to.exist;
    });

    it('should have getHelp component', () => {
      expect(formConfig.getHelp).to.exist;
    });

    it('should have footer content', () => {
      expect(formConfig.footerContent).to.exist;
    });
  });

  describe('Submit Configuration', () => {
    it('should have transformForSubmit function', () => {
      expect(formConfig.transformForSubmit).to.be.a('function');
    });
  });

  describe('Configuration Options', () => {
    it('should have tracking prefix', () => {
      expect(formConfig.trackingPrefix).to.include('21-0779');
    });

    it('should have version', () => {
      expect(formConfig.version).to.exist;
      expect(formConfig.version).to.be.a('number');
    });

    it('should have prefill disabled', () => {
      expect(formConfig.prefillEnabled).to.be.false;
    });

    it('should have dev configuration', () => {
      expect(formConfig.dev).to.exist;
      expect(formConfig.dev.showNavLinks).to.be.true;
      expect(formConfig.dev.collapsibleNavLinks).to.be.true;
    });
  });

  describe('Saved Form Messages', () => {
    it('should have savedFormMessages object', () => {
      expect(formConfig.savedFormMessages).to.exist;
      expect(formConfig.savedFormMessages).to.be.an('object');
    });
  });

  describe('Save In Progress', () => {
    it('should have save in progress configuration', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress).to.be.an('object');
    });
  });

  describe('Conditional Page Logic', () => {
    describe('Patient Information Conditional Pages', () => {
      it('should show claimant pages when patient is spouse', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouse',
          },
        };

        const claimantPersonalInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantPersonalInfo;
        const claimantIdentificationInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantIdentificationInfo;

        expect(claimantPersonalInfoPage.depends(formData)).to.be.true;
        expect(claimantIdentificationInfoPage.depends(formData)).to.be.true;
      });

      it('should show claimant pages when patient is parent', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'parent',
          },
        };

        const claimantPersonalInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantPersonalInfo;
        const claimantIdentificationInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantIdentificationInfo;

        expect(claimantPersonalInfoPage.depends(formData)).to.be.true;
        expect(claimantIdentificationInfoPage.depends(formData)).to.be.true;
      });

      it('should show claimant pages when patient is child', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'child',
          },
        };

        const claimantPersonalInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantPersonalInfo;
        const claimantIdentificationInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantIdentificationInfo;

        expect(claimantPersonalInfoPage.depends(formData)).to.be.true;
        expect(claimantIdentificationInfoPage.depends(formData)).to.be.true;
      });

      it('should hide claimant pages when patient is veteran', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
        };

        const claimantPersonalInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantPersonalInfo;
        const claimantIdentificationInfoPage =
          formConfig.chapters.patientInformationChapter.pages
            .claimantIdentificationInfo;

        expect(claimantPersonalInfoPage.depends(formData)).to.be.false;
        expect(claimantIdentificationInfoPage.depends(formData)).to.be.false;
      });
    });

    describe('Medicaid Conditional Pages', () => {
      it('should show medicaid start date when currently covered by medicaid', () => {
        const formData = {
          medicaidStatus: {
            currentlyCoveredByMedicaid: true,
          },
        };

        const medicaidStartDatePage =
          formConfig.chapters.medicaidChapter.pages.medicaidStartDate;

        expect(medicaidStartDatePage.depends).to.exist;
        expect(medicaidStartDatePage.depends(formData)).to.be.true;
      });

      it('should hide medicaid start date when not covered by medicaid', () => {
        const formData = {
          medicaidStatus: {
            currentlyCoveredByMedicaid: false,
          },
        };

        const medicaidStartDatePage =
          formConfig.chapters.medicaidChapter.pages.medicaidStartDate;

        expect(medicaidStartDatePage.depends(formData)).to.be.false;
      });

      it('should hide medicaid start date when medicaid status is undefined', () => {
        const formData = {
          medicaidStatus: {},
        };

        const medicaidStartDatePage =
          formConfig.chapters.medicaidChapter.pages.medicaidStartDate;

        expect(medicaidStartDatePage.depends(formData)).to.be.false;
      });

      it('should hide medicaid start date when medicaidStatus section is missing', () => {
        const formData = {};

        const medicaidStartDatePage =
          formConfig.chapters.medicaidChapter.pages.medicaidStartDate;

        expect(medicaidStartDatePage.depends(formData)).to.be.false;
      });
    });
  });
});
