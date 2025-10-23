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
      expect(formConfig.submitUrl).to.equal('/v0/api');
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
      expect(page.CustomPage).to.exist;
    });

    it('should have veteran identity page', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranIdentity;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-information');
      expect(page.CustomPage).to.exist;
    });

    it('should have veteran address page', () => {
      const page =
        formConfig.chapters.veteranInformationChapter.pages.veteranAddress;
      expect(page).to.exist;
      expect(page.path).to.equal('veteran-address');
      expect(page.CustomPage).to.exist;
    });

    it('should have claimant relationship page', () => {
      const page =
        formConfig.chapters.claimantInformationChapter.pages
          .claimantRelationship;
      expect(page).to.exist;
      expect(page.path).to.equal('claimant-relationship');
      expect(page.CustomPage).to.exist;
    });

    it('should have hospitalization status page', () => {
      const page =
        formConfig.chapters.hospitalizationChapter.pages.hospitalizationStatus;
      expect(page).to.exist;
      expect(page.path).to.equal('hospitalization-status');
      expect(page.CustomPage).to.exist;
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
});
