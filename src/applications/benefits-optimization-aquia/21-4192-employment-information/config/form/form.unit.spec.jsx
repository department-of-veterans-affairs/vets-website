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

    it('should have form ID', () => {
      expect(formConfig.formId).to.exist;
      expect(formConfig.formId).to.equal('21-4192');
    });

    it('should have title', () => {
      expect(formConfig.title).to.exist;
      expect(formConfig.title).to.include('Employment Information');
    });

    it('should have subtitle', () => {
      expect(formConfig.subTitle).to.exist;
      expect(formConfig.subTitle).to.include('21-4192');
    });

    it('should have rootUrl', () => {
      expect(formConfig.rootUrl).to.exist;
      expect(formConfig.rootUrl).to.be.a('string');
    });

    it('should have submitUrl', () => {
      expect(formConfig.submitUrl).to.equal('/v0/form21_4192');
    });
  });

  describe('Form Pages and Chapters', () => {
    it('should have chapters object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });

    it('should have veteranInformationChapter', () => {
      expect(formConfig.chapters.veteranInformationChapter).to.exist;
      expect(formConfig.chapters.veteranInformationChapter.title).to.equal(
        'Veteran Information',
      );
    });

    it('should have employerInformationChapter', () => {
      expect(formConfig.chapters.employerInformationChapter).to.exist;
      expect(formConfig.chapters.employerInformationChapter.title).to.equal(
        'Employers Information',
      );
    });

    it('should have employmentInformationChapter', () => {
      expect(formConfig.chapters.employmentInformationChapter).to.exist;
      expect(formConfig.chapters.employmentInformationChapter.title).to.equal(
        'Employment Information',
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
      expect(formConfig.chapters.benefitsInformationChapter.title).to.equal(
        'Benefits Information',
      );
    });

    it('should have remarksChapter', () => {
      expect(formConfig.chapters.remarksChapter).to.exist;
      expect(formConfig.chapters.remarksChapter.title).to.equal('Remarks');
    });
  });

  describe('Page Configuration', () => {
    it('should have veteran information page', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-information');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have employer information page', () => {
      const page =
        formConfig.chapters.employerInformationChapter.pages
          .employerInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('employer-information');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have employment dates page', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages.employmentDates;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-dates');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have employment concessions page', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages
          .employmentConcessions;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-concessions');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have employment termination page', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages
          .employmentTermination;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-termination');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have employment last payment page', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages
          .employmentLastPayment;
      expect(page).to.exist;
      expect(page.path).to.equal('employment-last-payment');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have duty status page', () => {
      const page = formConfig.chapters.dutyStatusChapter.pages.dutyStatus;
      expect(page).to.exist;
      expect(page.path).to.equal('duty-status');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have benefits information page', () => {
      const page =
        formConfig.chapters.benefitsInformationChapter.pages
          .benefitsInformation;
      expect(page).to.exist;
      expect(page.path).to.equal('benefits-information');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });

    it('should have remarks page', () => {
      const page = formConfig.chapters.remarksChapter.pages.remarks;
      expect(page).to.exist;
      expect(page.path).to.equal('remarks');
      expect(page.CustomPage).to.exist;
      expect(page.CustomPageReview).to.exist;
    });
  });

  describe('Page Validators', () => {
    it('should have validator for veteran information', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranInformation;
      expect(page.verifyItemValues).to.be.a('function');
    });

    it('should have validator for employer information', () => {
      const page =
        formConfig.chapters.employerInformationChapter.pages
          .employerInformation;
      expect(page.verifyItemValues).to.be.a('function');
    });

    it('should have error handlers for all pages', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranInformation;
      expect(page.onErrorChange).to.be.a('function');
    });

    it('should execute validator for veteran information', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranInformation;
      const validData = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
          ssn: '123-45-6789',
          dateOfBirth: '1985-03-22',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for employer information', () => {
      const page =
        formConfig.chapters.employerInformationChapter.pages
          .employerInformation;
      const validData = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for duty status', () => {
      const page = formConfig.chapters.dutyStatusChapter.pages.dutyStatus;
      const validData = {
        dutyStatus: {
          reserveOrGuardStatus: 'yes',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for benefits information', () => {
      const page =
        formConfig.chapters.benefitsInformationChapter.pages
          .benefitsInformation;
      const validData = {
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for employment dates', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages.employmentDates;
      const validData = {
        employmentDates: {
          beginningDate: '2024-01-01',
          endingDate: '2024-12-31',
          typeOfWork: 'Software Development',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for employment concessions', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages
          .employmentConcessions;
      const validData = {
        employmentConcessions: {
          concessionsMade: 'yes',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for employment termination', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages
          .employmentTermination;
      const validData = {
        employmentTermination: {
          terminationReason: 'resigned',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for employment last payment', () => {
      const page =
        formConfig.chapters.employmentInformationChapter.pages
          .employmentLastPayment;
      const validData = {
        employmentLastPayment: {
          lastPaymentDate: '2024-12-31',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });

    it('should execute validator for remarks', () => {
      const page = formConfig.chapters.remarksChapter.pages.remarks;
      const validData = {
        remarks: {
          remarks: 'The job is done.',
        },
      };
      const result = page.verifyItemValues(validData);
      expect(result).to.exist;
    });
  });

  describe('Save In Progress', () => {
    it('should have save in progress configuration', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress.messages).to.be.an('object');
    });

    it('should have in progress message', () => {
      expect(formConfig.saveInProgress.messages.inProgress).to.include(
        '21-4192',
      );
    });

    it('should have expired message', () => {
      expect(formConfig.saveInProgress.messages.expired).to.include('21-4192');
    });

    it('should have saved message', () => {
      expect(formConfig.saveInProgress.messages.saved).to.include('saved');
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
    it('should have submit function', () => {
      expect(formConfig.submit).to.be.a('function');
    });

    it('should return promise from submit', async () => {
      const result = formConfig.submit();
      expect(result).to.be.a('promise');
    });

    it('should resolve with confirmation number', async () => {
      const result = await formConfig.submit();
      expect(result.attributes.confirmationNumber).to.exist;
    });
  });

  describe('Configuration Options', () => {
    it('should have v3 segmented progress bar enabled', () => {
      expect(formConfig.v3SegmentedProgressBar).to.be.true;
    });

    it('should have tracking prefix', () => {
      expect(formConfig.trackingPrefix).to.include('21-4192');
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
    it('should have not found message', () => {
      expect(formConfig.savedFormMessages.notFound).to.exist;
    });

    it('should have no auth message', () => {
      expect(formConfig.savedFormMessages.noAuth).to.exist;
    });
  });
});
