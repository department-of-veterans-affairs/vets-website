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
      expect(formConfig.formId).to.equal('21-2680');
    });

    it('should have title', () => {
      expect(formConfig.title).to.exist;
      expect(formConfig.title).to.include('Housebound');
    });

    it('should have subtitle', () => {
      expect(formConfig.subTitle).to.exist;
      expect(formConfig.subTitle).to.include('21-2680');
    });

    it('should have rootUrl', () => {
      expect(formConfig.rootUrl).to.exist;
      expect(formConfig.rootUrl).to.be.a('string');
    });

    it('should have submitUrl', () => {
      expect(formConfig.submitUrl).to.include('/v0/form212680');
    });
  });

  describe('Form Chapters and Pages', () => {
    it('should have chapters object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });

    it('should have veteranInformationChapter', () => {
      expect(formConfig.chapters.veteranInformationChapter).to.exist;
      expect(formConfig.chapters.veteranInformationChapter.title).to.include(
        'Veteran',
      );
    });

    it('should have claimantInformationChapter', () => {
      expect(formConfig.chapters.claimantInformationChapter).to.exist;
      expect(formConfig.chapters.claimantInformationChapter.title).to.include(
        'Claimant',
      );
    });

    it('should have claimInformationChapter', () => {
      expect(formConfig.chapters.claimInformationChapter).to.exist;
      expect(formConfig.chapters.claimInformationChapter.title).to.include(
        'Claim information',
      );
    });

    it('should have hospitalizationChapter', () => {
      expect(formConfig.chapters.hospitalizationChapter).to.exist;
      expect(formConfig.chapters.hospitalizationChapter.title).to.include(
        'Hospitalization',
      );
    });
  });

  describe('Page Configuration', () => {
    it('should have benefit type page', () => {
      const page =
        formConfig.chapters.claimInformationChapter.pages.benefitType;
      expect(page).to.exist;
      expect(page.path).to.equal('benefit-type');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have veteran information page', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-information');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have veteran address page', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranAddress;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-address');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have claimant relationship page', () => {
      const page =
        formConfig.chapters.claimantInformationChapter.pages
          .claimantRelationship;
      expect(page).to.exist;
      expect(page.path).to.equal('claimant-relationship');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have hospitalization status page', () => {
      const page =
        formConfig.chapters.hospitalizationChapter.pages.hospitalizationStatus;
      expect(page).to.exist;
      expect(page.path).to.equal('hospitalization-status');
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
      expect(formConfig.trackingPrefix).to.include('21-2680');
    });

    it('should have version', () => {
      expect(formConfig.version).to.exist;
      expect(formConfig.version).to.be.a('number');
    });

    it('should have prefill enabled', () => {
      expect(formConfig.prefillEnabled).to.be.true;
    });

    it('should have prefill transformer', () => {
      expect(formConfig.prefillTransformer).to.exist;
      expect(formConfig.prefillTransformer).to.be.a('function');
    });

    it('should have submit transformer', () => {
      expect(formConfig.transformForSubmit).to.exist;
      expect(formConfig.transformForSubmit).to.be.a('function');
    });

    it('should have dev configuration', () => {
      expect(formConfig.dev).to.exist;
      expect(formConfig.dev.showNavLinks).to.be.true;
      expect(formConfig.dev.collapsibleNavLinks).to.be.true;
    });
  });

  describe('Saved Form Messages', () => {
    it('should have not found message', () => {
      expect(formConfig.savedFormMessages.notFound).to.exist;
    });

    it('should have no auth message', () => {
      expect(formConfig.savedFormMessages.noAuth).to.exist;
    });
  });

  describe('Save In Progress', () => {
    it('should have save in progress configuration', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress).to.be.an('object');
    });
  });

  describe('Conditional Page Logic', () => {
    describe('Claimant Information Conditional Pages', () => {
      it('should show claimant pages when claimantRelationship is not veteran', () => {
        const formData = {
          claimantRelationship: {
            relationship: 'spouse',
          },
        };

        const claimantInfoPage =
          formConfig.chapters.claimantInformationChapter.pages
            .claimantInformation;
        const claimantSSNPage =
          formConfig.chapters.claimantInformationChapter.pages.claimantSSN;
        const claimantAddressPage =
          formConfig.chapters.claimantInformationChapter.pages.claimantAddress;
        const claimantContactPage =
          formConfig.chapters.claimantInformationChapter.pages.claimantContact;

        expect(claimantInfoPage.depends(formData)).to.be.true;
        expect(claimantSSNPage.depends(formData)).to.be.true;
        expect(claimantAddressPage.depends(formData)).to.be.true;
        expect(claimantContactPage.depends(formData)).to.be.true;
      });

      it('should hide claimant pages when claimantRelationship is veteran', () => {
        const formData = {
          claimantRelationship: {
            relationship: 'veteran',
          },
        };

        const claimantInfoPage =
          formConfig.chapters.claimantInformationChapter.pages
            .claimantInformation;
        const claimantSSNPage =
          formConfig.chapters.claimantInformationChapter.pages.claimantSSN;
        const claimantAddressPage =
          formConfig.chapters.claimantInformationChapter.pages.claimantAddress;
        const claimantContactPage =
          formConfig.chapters.claimantInformationChapter.pages.claimantContact;

        expect(claimantInfoPage.depends(formData)).to.be.false;
        expect(claimantSSNPage.depends(formData)).to.be.false;
        expect(claimantAddressPage.depends(formData)).to.be.false;
        expect(claimantContactPage.depends(formData)).to.be.false;
      });
    });

    describe('Hospitalization Conditional Pages', () => {
      it('should show hospitalization date page when currently hospitalized is true', () => {
        const formData = {
          hospitalizationStatus: {
            isCurrentlyHospitalized: true,
          },
        };

        const hospitalizationDatePage =
          formConfig.chapters.hospitalizationChapter.pages.hospitalizationDate;

        expect(hospitalizationDatePage.depends).to.exist;
        expect(hospitalizationDatePage.depends(formData)).to.be.true;
      });

      it('should show hospitalization facility page when currently hospitalized is true', () => {
        const formData = {
          hospitalizationStatus: {
            isCurrentlyHospitalized: true,
          },
        };

        const hospitalizationFacilityPage =
          formConfig.chapters.hospitalizationChapter.pages
            .hospitalizationFacility;

        expect(hospitalizationFacilityPage.depends).to.exist;
        expect(hospitalizationFacilityPage.depends(formData)).to.be.true;
      });

      it('should hide hospitalization date page when currently hospitalized is false', () => {
        const formData = {
          hospitalizationStatus: {
            isCurrentlyHospitalized: false,
          },
        };

        const hospitalizationDatePage =
          formConfig.chapters.hospitalizationChapter.pages.hospitalizationDate;

        expect(hospitalizationDatePage.depends(formData)).to.be.false;
      });

      it('should hide hospitalization facility page when currently hospitalized is false', () => {
        const formData = {
          hospitalizationStatus: {
            isCurrentlyHospitalized: false,
          },
        };

        const hospitalizationFacilityPage =
          formConfig.chapters.hospitalizationChapter.pages
            .hospitalizationFacility;

        expect(hospitalizationFacilityPage.depends(formData)).to.be.false;
      });

      it('should hide hospitalization pages when isCurrentlyHospitalized is undefined', () => {
        const formData = {
          hospitalizationStatus: {},
        };

        const hospitalizationDatePage =
          formConfig.chapters.hospitalizationChapter.pages.hospitalizationDate;
        const hospitalizationFacilityPage =
          formConfig.chapters.hospitalizationChapter.pages
            .hospitalizationFacility;

        expect(hospitalizationDatePage.depends(formData)).to.be.false;
        expect(hospitalizationFacilityPage.depends(formData)).to.be.false;
      });

      it('should hide hospitalization pages when hospitalizationStatus section is missing', () => {
        const formData = {};

        const hospitalizationDatePage =
          formConfig.chapters.hospitalizationChapter.pages.hospitalizationDate;
        const hospitalizationFacilityPage =
          formConfig.chapters.hospitalizationChapter.pages
            .hospitalizationFacility;

        expect(hospitalizationDatePage.depends(formData)).to.be.false;
        expect(hospitalizationFacilityPage.depends(formData)).to.be.false;
      });

      it('should use correct data path for hospitalization conditional (formData.hospitalizationStatus.isCurrentlyHospitalized)', () => {
        // This test ensures the bug fix is working correctly
        const formDataWithCorrectPath = {
          hospitalizationStatus: {
            isCurrentlyHospitalized: true,
          },
        };

        const formDataWithIncorrectPath = {
          isCurrentlyHospitalized: true, // Wrong - at root level
        };

        const hospitalizationDatePage =
          formConfig.chapters.hospitalizationChapter.pages.hospitalizationDate;

        // Should work with correct nested path
        expect(hospitalizationDatePage.depends(formDataWithCorrectPath)).to.be
          .true;

        // Should NOT work with incorrect root-level path
        expect(hospitalizationDatePage.depends(formDataWithIncorrectPath)).to.be
          .false;
      });
    });
  });
});
