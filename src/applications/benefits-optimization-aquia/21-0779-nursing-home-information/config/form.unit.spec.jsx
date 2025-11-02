import { expect } from 'chai';

import { formConfig } from './form';

describe('Form Configuration', () => {
  describe('Basic Configuration', () => {
    it('should export formConfig object', () => {
      expect(formConfig).to.exist;
      expect(formConfig).to.be.an('object');
    });

    it('should have rootUrl property', () => {
      expect(formConfig.rootUrl).to.exist;
      expect(formConfig.rootUrl).to.be.a('string');
    });

    it('should have urlPrefix property', () => {
      expect(formConfig.urlPrefix).to.equal('/');
    });

    it('should have submitUrl property', () => {
      expect(formConfig.submitUrl).to.exist;
      expect(formConfig.submitUrl).to.include('form210779');
    });

    it('should have transformForSubmit function', () => {
      expect(formConfig.transformForSubmit).to.exist;
      expect(formConfig.transformForSubmit).to.be.a('function');
    });

    it('should have trackingPrefix', () => {
      expect(formConfig.trackingPrefix).to.equal(
        '21-0779-nursing-home-information-',
      );
    });

    it('should use v3 segmented progress bar', () => {
      expect(formConfig.v3SegmentedProgressBar).to.be.true;
    });

    it('should have formId', () => {
      expect(formConfig.formId).to.exist;
      expect(formConfig.formId).to.equal('21-0779');
    });

    it('should have title and subtitle', () => {
      expect(formConfig.title).to.exist;
      expect(formConfig.subTitle).to.exist;
    });

    it('should have version number', () => {
      expect(formConfig.version).to.equal(0);
    });

    it('should have prefillEnabled set to false', () => {
      expect(formConfig.prefillEnabled).to.be.false;
    });
  });

  describe('Page Components', () => {
    it('should have introduction page', () => {
      expect(formConfig.introduction).to.exist;
      expect(formConfig.introduction).to.be.a('function');
    });

    it('should have confirmation page', () => {
      expect(formConfig.confirmation).to.exist;
      expect(formConfig.confirmation).to.be.a('function');
    });

    it('should have footer content', () => {
      expect(formConfig.footerContent).to.exist;
    });

    it('should have getHelp component', () => {
      expect(formConfig.getHelp).to.exist;
      expect(formConfig.getHelp).to.be.a('function');
    });

    it('should have preSubmitInfo configuration', () => {
      expect(formConfig.preSubmitInfo).to.exist;
      expect(formConfig.preSubmitInfo).to.be.an('object');
      expect(formConfig.preSubmitInfo.required).to.be.true;
    });
  });

  describe('Dev Configuration', () => {
    it('should have dev configuration', () => {
      expect(formConfig.dev).to.exist;
      expect(formConfig.dev).to.be.an('object');
    });

    it('should disable nav links in dev mode', () => {
      expect(formConfig.dev.showNavLinks).to.be.false;
      expect(formConfig.dev.collapsibleNavLinks).to.be.false;
    });
  });

  describe('Save In Progress Configuration', () => {
    it('should have saveInProgress configuration', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress.messages).to.exist;
    });

    it('should have in progress message', () => {
      expect(formConfig.saveInProgress.messages.inProgress).to.include(
        '21-0779',
      );
      expect(formConfig.saveInProgress.messages.inProgress).to.include(
        'in progress',
      );
    });

    it('should have expired message', () => {
      expect(formConfig.saveInProgress.messages.expired).to.include('21-0779');
      expect(formConfig.saveInProgress.messages.expired).to.include('expired');
    });

    it('should have saved message', () => {
      expect(formConfig.saveInProgress.messages.saved).to.include(
        'has been saved',
      );
    });
  });

  describe('Chapters Configuration', () => {
    it('should have chapters object', () => {
      expect(formConfig.chapters).to.exist;
      expect(formConfig.chapters).to.be.an('object');
    });

    it('should have nursingOfficialPersonalChapter', () => {
      expect(formConfig.chapters.nursingOfficialPersonalChapter).to.exist;
      expect(formConfig.chapters.nursingOfficialPersonalChapter.title).to.equal(
        'Your personal information',
      );
    });

    it('should have nursingHomeChapter', () => {
      expect(formConfig.chapters.nursingHomeChapter).to.exist;
      expect(formConfig.chapters.nursingHomeChapter.title).to.equal(
        'Nursing home information',
      );
    });

    it('should have patientInformationChapter', () => {
      expect(formConfig.chapters.patientInformationChapter).to.exist;
      expect(formConfig.chapters.patientInformationChapter.title).to.equal(
        'Patient information',
      );
    });

    it('should have levelOfCareChapter', () => {
      expect(formConfig.chapters.levelOfCareChapter).to.exist;
      expect(formConfig.chapters.levelOfCareChapter.title).to.equal(
        'Level of care',
      );
    });

    it('should have medicaidChapter', () => {
      expect(formConfig.chapters.medicaidChapter).to.exist;
      expect(formConfig.chapters.medicaidChapter.title).to.equal('Medicaid');
    });

    it('should have costsChapter', () => {
      expect(formConfig.chapters.costsChapter).to.exist;
      expect(formConfig.chapters.costsChapter.title).to.equal(
        'Cost information',
      );
    });

    it('should have exactly 6 chapters', () => {
      const chapterKeys = Object.keys(formConfig.chapters);
      expect(chapterKeys.length).to.equal(6);
    });
  });

  describe('Page Configurations', () => {
    it('should have nursingOfficialInformation page', () => {
      const page =
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('nursing-official-information');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have nursingHomeDetails page', () => {
      const page =
        formConfig.chapters.nursingHomeChapter.pages.nursingHomeDetails;
      expect(page).to.exist;
      expect(page.path).to.equal('nursing-home-details');
      expect(page.CustomPage).to.exist;
    });

    it('should have claimantQuestion page', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.claimantQuestion;
      expect(page).to.exist;
      expect(page.path).to.equal('claimant-question');
    });

    it('should have veteranPersonalInfo page', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.veteranPersonalInfo;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-personal-info');
    });

    it('should have certificationLevelOfCare page', () => {
      const page =
        formConfig.chapters.levelOfCareChapter.pages.certificationLevelOfCare;
      expect(page).to.exist;
      expect(page.path).to.equal('certification-level-of-care');
    });

    it('should have admissionDate page', () => {
      const page = formConfig.chapters.levelOfCareChapter.pages.admissionDate;
      expect(page).to.exist;
      expect(page.path).to.equal('admission-date');
    });

    it('should have medicaidFacility page', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidFacility;
      expect(page).to.exist;
      expect(page.path).to.equal('medicaid-facility');
    });

    it('should have monthlyCosts page', () => {
      const page = formConfig.chapters.costsChapter.pages.monthlyCosts;
      expect(page).to.exist;
      expect(page.path).to.equal('monthly-costs');
    });
  });

  describe('Page Validators', () => {
    it('should have verifyItemValues for nursingOfficialInformation', () => {
      const page =
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation;
      expect(page.verifyItemValues).to.exist;
      expect(page.verifyItemValues).to.be.a('function');
    });

    it('should call verifyItemValues for nursingOfficialInformation with valid data', () => {
      const page =
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation;
      const validData = {
        nursingOfficialInformation: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'test@example.com',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for nursingOfficialInformation with invalid data', () => {
      const page =
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation;
      const invalidData = {};
      const result = page.verifyItemValues(invalidData);
      expect(result).to.exist;
    });

    it('should have verifyItemValues for claimantQuestion', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.claimantQuestion;
      expect(page.verifyItemValues).to.exist;
      expect(page.verifyItemValues).to.be.a('function');
    });

    it('should call verifyItemValues for claimantQuestion', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.claimantQuestion;
      const data = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should have verifyItemValues for monthlyCosts', () => {
      const page = formConfig.chapters.costsChapter.pages.monthlyCosts;
      expect(page.verifyItemValues).to.exist;
      expect(page.verifyItemValues).to.be.a('function');
    });

    it('should call verifyItemValues for monthlyCosts', () => {
      const page = formConfig.chapters.costsChapter.pages.monthlyCosts;
      const data = {
        monthlyCosts: {
          monthlyCharge: '1000',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for nursingHomeDetails', () => {
      const page =
        formConfig.chapters.nursingHomeChapter.pages.nursingHomeDetails;
      const data = {
        nursingHomeDetails: {
          facilityName: 'Test Facility',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for claimantPersonalInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      const data = {
        claimantPersonalInfo: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for claimantIdentificationInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantIdentificationInfo;
      const data = {
        claimantIdentificationInfo: {
          ssn: '123456789',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for veteranPersonalInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages.veteranPersonalInfo;
      const data = {
        veteranPersonalInfo: {
          firstName: 'John',
          lastName: 'Veteran',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for veteranIdentificationInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .veteranIdentificationInfo;
      const data = {
        veteranIdentificationInfo: {
          ssn: '987654321',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for certificationLevelOfCare', () => {
      const page =
        formConfig.chapters.levelOfCareChapter.pages.certificationLevelOfCare;
      const data = {
        certificationLevelOfCare: {
          levelOfCare: 'skilled',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for admissionDate', () => {
      const page = formConfig.chapters.levelOfCareChapter.pages.admissionDate;
      const data = {
        admissionDateInfo: {
          admissionDate: '2023-01-01',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for medicaidFacility', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidFacility;
      const data = {
        medicaidFacility: {
          approvedByMedicaid: 'yes',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for medicaidApplication', () => {
      const page =
        formConfig.chapters.medicaidChapter.pages.medicaidApplication;
      const data = {
        medicaidApplication: {
          appliedForMedicaid: 'yes',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for medicaidStatus', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStatus;
      const data = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: 'yes',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });

    it('should call verifyItemValues for medicaidStartDate', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStartDate;
      const data = {
        medicaidStartDateInfo: {
          medicaidStartDate: '2023-01-01',
        },
      };
      const result = page.verifyItemValues(data);
      expect(result).to.exist;
    });
  });

  describe('Error Handlers', () => {
    it('should have onErrorChange for all pages with validators', () => {
      const page =
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation;
      expect(page.onErrorChange).to.exist;
      expect(page.onErrorChange).to.be.a('function');
    });

    it('should have onErrorChange for claimantPersonalInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      expect(page.onErrorChange).to.exist;
      expect(page.onErrorChange).to.be.a('function');
    });

    it('should have onErrorChange for nursingHomeDetails', () => {
      const page =
        formConfig.chapters.nursingHomeChapter.pages.nursingHomeDetails;
      expect(page.onErrorChange).to.exist;
      expect(page.onErrorChange).to.be.a('function');
    });

    it('should have onErrorChange for all pages with error handlers', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      const pagesWithErrorHandlers = allPages.filter(
        page => page.onErrorChange,
      );
      expect(pagesWithErrorHandlers.length).to.be.greaterThan(0);
      pagesWithErrorHandlers.forEach(page => {
        expect(page.onErrorChange).to.be.a('function');
      });
    });
  });

  describe('Conditional Pages (depends)', () => {
    it('should have depends function for claimantPersonalInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      expect(page.depends).to.exist;
      expect(page.depends).to.be.a('function');
    });

    it('should show claimantPersonalInfo when patientType is spouseOrParent', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      const formData = {
        claimantQuestion: {
          patientType: 'spouseOrParent',
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should hide claimantPersonalInfo when patientType is not spouseOrParent', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      const formData = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should hide claimantPersonalInfo when formData is undefined', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      expect(page.depends(undefined)).to.be.false;
    });

    it('should hide claimantPersonalInfo when claimantQuestion is undefined', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantPersonalInfo;
      expect(page.depends({})).to.be.false;
    });

    it('should have depends function for claimantIdentificationInfo', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantIdentificationInfo;
      expect(page.depends).to.exist;
      expect(page.depends).to.be.a('function');
    });

    it('should show claimantIdentificationInfo when patientType is spouseOrParent', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantIdentificationInfo;
      const formData = {
        claimantQuestion: {
          patientType: 'spouseOrParent',
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should hide claimantIdentificationInfo when patientType is not spouseOrParent', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantIdentificationInfo;
      const formData = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should hide claimantIdentificationInfo when formData is undefined', () => {
      const page =
        formConfig.chapters.patientInformationChapter.pages
          .claimantIdentificationInfo;
      expect(page.depends(undefined)).to.be.false;
    });

    it('should have depends function for medicaidStartDate', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStartDate;
      expect(page.depends).to.exist;
      expect(page.depends).to.be.a('function');
    });

    it('should show medicaidStartDate when currently covered by medicaid', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStartDate;
      const formData = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: 'yes',
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should hide medicaidStartDate when not covered by medicaid', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStartDate;
      const formData = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: 'no',
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should hide medicaidStartDate when formData is undefined', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStartDate;
      expect(page.depends(undefined)).to.be.false;
    });

    it('should hide medicaidStartDate when medicaidStatus is undefined', () => {
      const page = formConfig.chapters.medicaidChapter.pages.medicaidStartDate;
      expect(page.depends({})).to.be.false;
    });
  });

  describe('Custom Pages and Reviews', () => {
    it('should have CustomPage for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.CustomPage).to.exist;
      });
    });

    it('should have CustomPageReview for pages with reviews', () => {
      const reviewPages = [
        formConfig.chapters.nursingOfficialPersonalChapter.pages
          .nursingOfficialInformation,
        formConfig.chapters.nursingHomeChapter.pages.nursingHomeDetails,
        formConfig.chapters.patientInformationChapter.pages.claimantQuestion,
      ];

      reviewPages.forEach(page => {
        expect(page.CustomPageReview).to.exist;
      });
    });
  });

  describe('Schema Configuration', () => {
    it('should have uiSchema for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.uiSchema).to.exist;
        expect(page.uiSchema).to.be.an('object');
      });
    });

    it('should have schema for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.schema).to.exist;
        expect(page.schema).to.be.an('object');
      });
    });
  });

  describe('Total Page Count', () => {
    it('should have correct number of pages across all chapters', () => {
      const totalPages = Object.values(formConfig.chapters).reduce(
        (count, chapter) => {
          return count + Object.keys(chapter.pages).length;
        },
        0,
      );
      expect(totalPages).to.be.greaterThan(10);
    });
  });

  describe('Default Definitions', () => {
    it('should have defaultDefinitions', () => {
      expect(formConfig.defaultDefinitions).to.exist;
      expect(formConfig.defaultDefinitions).to.be.an('object');
    });

    it('should have savedFormMessages', () => {
      expect(formConfig.savedFormMessages).to.exist;
      expect(formConfig.savedFormMessages).to.be.an('object');
    });
  });

  describe('Page Schema Configuration', () => {
    it('should use defaultSchema for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.schema).to.exist;
        expect(page.schema.type).to.equal('object');
        expect(page.schema.properties).to.exist;
      });
    });

    it('should have title for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.title).to.exist;
        expect(page.title).to.be.a('string');
      });
    });

    it('should have path for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.path).to.exist;
        expect(page.path).to.be.a('string');
      });
    });

    it('should have verifyItemValues for all pages', () => {
      const allPages = Object.values(formConfig.chapters).flatMap(chapter =>
        Object.values(chapter.pages),
      );
      allPages.forEach(page => {
        expect(page.verifyItemValues).to.exist;
        expect(page.verifyItemValues).to.be.a('function');
      });
    });
  });
});
