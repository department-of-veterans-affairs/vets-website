/**
 * @module tests/config/form.unit.spec
 * @description Unit tests for form configuration
 */

import { expect } from 'chai';
import formConfig from './form';

describe('Form Configuration', () => {
  describe('Basic Structure', () => {
    it('should export form config object', () => {
      expect(formConfig).to.be.an('object');
    });

    it('should have correct form ID', () => {
      expect(formConfig.formId).to.exist;
      expect(formConfig.formId).to.equal('21-4192');
    });

    it('should have title', () => {
      expect(formConfig.title).to.exist;
      expect(formConfig.title).to.be.a('string');
      expect(formConfig.title).to.include('Employment Information');
    });

    it('should have subtitle', () => {
      expect(formConfig.subTitle).to.exist;
      expect(formConfig.subTitle).to.include('21-4192');
      expect(formConfig.subTitle).to.include('Employment Information');
    });

    it('should have rootUrl', () => {
      expect(formConfig.rootUrl).to.exist;
      expect(formConfig.rootUrl).to.be.a('string');
    });

    it('should have submitUrl', () => {
      expect(formConfig.submitUrl).to.exist;
      expect(formConfig.submitUrl).to.include('/v0/form214192');
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

    it('should have employerInformationChapter', () => {
      expect(formConfig.chapters.employerInformationChapter).to.exist;
      expect(formConfig.chapters.employerInformationChapter.title).to.include(
        'Employer',
      );
    });

    it('should have employmentInformationChapter', () => {
      expect(formConfig.chapters.employmentInformationChapter).to.exist;
      expect(formConfig.chapters.employmentInformationChapter.title).to.include(
        'Employment',
      );
    });

    it('should have dutyStatusChapter', () => {
      expect(formConfig.chapters.dutyStatusChapter).to.exist;
      expect(formConfig.chapters.dutyStatusChapter.title).to.equal(
        'Duty Status',
      );
    });

    it('should have benefitsInformationChapter', () => {
      expect(formConfig.chapters.benefitsInformationChapter).to.exist;
      expect(formConfig.chapters.benefitsInformationChapter.title).to.include(
        'Benefits',
      );
    });

    it('should have remarksChapter', () => {
      expect(formConfig.chapters.remarksChapter).to.exist;
      expect(formConfig.chapters.remarksChapter.title).to.equal('Remarks');
    });

    it('should have exactly 6 chapters', () => {
      expect(Object.keys(formConfig.chapters)).to.have.lengthOf(6);
    });
  });

  describe('Veteran Information Chapter Pages', () => {
    const chapter = formConfig.chapters.veteranInformationChapter;

    it('should have veteranInformation page', () => {
      const page = chapter.pages.veteranInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-information');
      expect(page.title).to.equal('Veteran Information');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have veteranContactInformation page', () => {
      const page = chapter.pages.veteranContactInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-contact-information');
      expect(page.title).to.equal('Veteran Contact Information');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have exactly 2 pages in veteran information chapter', () => {
      expect(Object.keys(chapter.pages)).to.have.lengthOf(2);
    });
  });

  describe('Employer Information Chapter Pages', () => {
    const chapter = formConfig.chapters.employerInformationChapter;

    it('should have employerInformation page', () => {
      const page = chapter.pages.employerInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('employer-information');
      expect(page.title).to.equal('Employers Information');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('should have exactly 1 page in employer information chapter', () => {
      expect(Object.keys(chapter.pages)).to.have.lengthOf(1);
    });
  });

  describe('Employment Information Chapter Pages', () => {
    const chapter = formConfig.chapters.employmentInformationChapter;

    it('should have employmentDates page', () => {
      const page = chapter.pages.employmentDates;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-dates');
    });

    it('should have employmentEarningsHours page', () => {
      const page = chapter.pages.employmentEarningsHours;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-earnings-hours');
    });

    it('should have employmentConcessions page', () => {
      const page = chapter.pages.employmentConcessions;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-concessions');
    });

    it('should have employmentTermination page', () => {
      const page = chapter.pages.employmentTermination;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-termination');
    });

    it('should have employmentLastPayment page', () => {
      const page = chapter.pages.employmentLastPayment;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-last-payment');
    });

    it('should have exactly 5 pages in employment information chapter', () => {
      expect(Object.keys(chapter.pages)).to.have.lengthOf(5);
    });
  });

  describe('Duty Status Chapter Pages', () => {
    const chapter = formConfig.chapters.dutyStatusChapter;

    it('should have dutyStatus page', () => {
      const page = chapter.pages.dutyStatus;
      expect(page).to.exist;
      expect(page.path).to.equal('duty-status');
    });

    it('should have dutyStatusDetails page', () => {
      const page = chapter.pages.dutyStatusDetails;
      expect(page).to.exist;
      expect(page.path).to.equal('duty-status-details');
    });

    it('should have conditional depends on dutyStatusDetails page', () => {
      const page = chapter.pages.dutyStatusDetails;
      expect(page.depends).to.be.a('function');
    });

    it('should show dutyStatusDetails when reserveOrGuardStatus is true', () => {
      const page = chapter.pages.dutyStatusDetails;
      const formData = {
        dutyStatus: {
          reserveOrGuardStatus: true,
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should hide dutyStatusDetails when reserveOrGuardStatus is false', () => {
      const page = chapter.pages.dutyStatusDetails;
      const formData = {
        dutyStatus: {
          reserveOrGuardStatus: false,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should hide dutyStatusDetails when dutyStatus section missing', () => {
      const page = chapter.pages.dutyStatusDetails;
      const formData = {};
      expect(page.depends(formData)).to.be.false;
    });

    it('should have exactly 2 pages in duty status chapter', () => {
      expect(Object.keys(chapter.pages)).to.have.lengthOf(2);
    });
  });

  describe('Benefits Information Chapter Pages', () => {
    const chapter = formConfig.chapters.benefitsInformationChapter;

    it('should have benefitsInformation page', () => {
      const page = chapter.pages.benefitsInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('benefits-information');
    });

    it('should have benefitsDetails page', () => {
      const page = chapter.pages.benefitsDetails;
      expect(page).to.exist;
      expect(page.path).to.equal('benefits-details');
    });

    it('should have conditional depends on benefitsDetails page', () => {
      const page = chapter.pages.benefitsDetails;
      expect(page.depends).to.be.a('function');
    });

    it('should show benefitsDetails when benefitEntitlement is true', () => {
      const page = chapter.pages.benefitsDetails;
      const formData = {
        benefitsInformation: {
          benefitEntitlement: true,
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should hide benefitsDetails when benefitEntitlement is false', () => {
      const page = chapter.pages.benefitsDetails;
      const formData = {
        benefitsInformation: {
          benefitEntitlement: false,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should hide benefitsDetails when benefitsInformation section missing', () => {
      const page = chapter.pages.benefitsDetails;
      const formData = {};
      expect(page.depends(formData)).to.be.false;
    });

    it('should have exactly 2 pages in benefits information chapter', () => {
      expect(Object.keys(chapter.pages)).to.have.lengthOf(2);
    });
  });

  describe('Remarks Chapter Pages', () => {
    const chapter = formConfig.chapters.remarksChapter;

    it('should have remarks page', () => {
      const page = chapter.pages.remarks;
      expect(page).to.exist;
      expect(page.path).to.equal('remarks');
    });

    it('should have exactly 1 page in remarks chapter', () => {
      expect(Object.keys(chapter.pages)).to.have.lengthOf(1);
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
      expect(formConfig.trackingPrefix).to.include('21-4192');
    });

    it('should have version', () => {
      expect(formConfig.version).to.exist;
      expect(formConfig.version).to.be.a('number');
    });

    it('should have prefill enabled set to false', () => {
      expect(formConfig.prefillEnabled).to.be.false;
    });

    it('should have dev configuration', () => {
      expect(formConfig.dev).to.exist;
      expect(formConfig.dev.showNavLinks).to.be.true;
      expect(formConfig.dev.collapsibleNavLinks).to.be.true;
    });

    it('should have v3SegmentedProgressBar enabled', () => {
      expect(formConfig.v3SegmentedProgressBar).to.be.true;
    });
  });

  describe('Save In Progress Configuration', () => {
    it('should have save in progress messages', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress.messages).to.exist;
    });

    it('should have inProgress message', () => {
      expect(formConfig.saveInProgress.messages.inProgress).to.include(
        '21-4192',
      );
    });

    it('should have expired message', () => {
      expect(formConfig.saveInProgress.messages.expired).to.include('21-4192');
    });

    it('should have saved message', () => {
      expect(formConfig.saveInProgress.messages.saved).to.exist;
    });
  });

  describe('Saved Form Messages', () => {
    it('should have saved form messages', () => {
      expect(formConfig.savedFormMessages).to.exist;
    });

    it('should have notFound message', () => {
      expect(formConfig.savedFormMessages.notFound).to.exist;
    });

    it('should have noAuth message', () => {
      expect(formConfig.savedFormMessages.noAuth).to.exist;
    });
  });

  describe('Pre-Submit Info Configuration', () => {
    it('should have pre-submit info configuration', () => {
      expect(formConfig.preSubmitInfo).to.exist;
    });

    it('should have statementOfTruth configuration', () => {
      expect(formConfig.preSubmitInfo.statementOfTruth).to.exist;
    });

    it('should have statementOfTruth body text', () => {
      expect(formConfig.preSubmitInfo.statementOfTruth.body).to.equal(
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      );
    });

    it('should have statementOfTruth messageAriaDescribedby', () => {
      expect(
        formConfig.preSubmitInfo.statementOfTruth.messageAriaDescribedby,
      ).to.equal(
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      );
    });

    it('should have fullNamePath set to veteranInformation.veteranFullName', () => {
      expect(formConfig.preSubmitInfo.statementOfTruth.fullNamePath).to.equal(
        'veteranInformation.veteranFullName',
      );
    });
  });

  describe('URL Prefix Configuration', () => {
    it('should have URL prefix set to root', () => {
      expect(formConfig.urlPrefix).to.equal('/');
    });
  });

  describe('Page Schema Validation', () => {
    it('all pages should have both uiSchema and schema', () => {
      Object.values(formConfig.chapters).forEach(chapter => {
        Object.values(chapter.pages).forEach(page => {
          expect(page.uiSchema).to.exist;
          expect(page.schema).to.exist;
        });
      });
    });

    it('all pages should have a path property', () => {
      Object.values(formConfig.chapters).forEach(chapter => {
        Object.values(chapter.pages).forEach(page => {
          expect(page.path).to.exist;
          expect(page.path).to.be.a('string');
        });
      });
    });

    it('all pages should have a title property', () => {
      Object.values(formConfig.chapters).forEach(chapter => {
        Object.values(chapter.pages).forEach(page => {
          expect(page.title).to.exist;
          expect(page.title).to.be.a('string');
        });
      });
    });
  });

  describe('Conditional Logic Consistency', () => {
    it('should handle missing form data gracefully in depends functions', () => {
      const dutyStatusDetailsPage =
        formConfig.chapters.dutyStatusChapter.pages.dutyStatusDetails;
      expect(() => dutyStatusDetailsPage.depends(null)).to.not.throw();
      expect(() => dutyStatusDetailsPage.depends(undefined)).to.not.throw();
      expect(() => dutyStatusDetailsPage.depends({})).to.not.throw();
    });

    it('should handle missing nested form data in benefits conditional', () => {
      const benefitsDetailsPage =
        formConfig.chapters.benefitsInformationChapter.pages.benefitsDetails;
      expect(() => benefitsDetailsPage.depends(null)).to.not.throw();
      expect(() => benefitsDetailsPage.depends(undefined)).to.not.throw();
      expect(() => benefitsDetailsPage.depends({})).to.not.throw();
      expect(() =>
        benefitsDetailsPage.depends({ benefitsInformation: null }),
      ).to.not.throw();
    });
  });

  describe('Form Configuration Exports', () => {
    it('should export form config as default export', () => {
      expect(formConfig).to.exist;
    });

    it('should have all required top-level properties', () => {
      const requiredProps = [
        'formId',
        'title',
        'subTitle',
        'rootUrl',
        'chapters',
        'introduction',
        'confirmation',
        'transformForSubmit',
      ];

      requiredProps.forEach(prop => {
        expect(formConfig).to.have.property(prop);
      });
    });
  });
});
