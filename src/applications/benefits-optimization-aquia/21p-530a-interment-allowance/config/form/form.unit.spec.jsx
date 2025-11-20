/**
 * @module tests/config/form.unit.spec
 * @description Unit tests for form configuration
 */

import { expect } from 'chai';
import formConfig from './form';

describe('Form Configuration', () => {
  describe('Basic Structure', () => {
    it('should export a form config object', () => {
      expect(formConfig).to.exist;
      expect(formConfig).to.be.an('object');
    });

    it('should have required top-level properties', () => {
      expect(formConfig).to.have.property('rootUrl');
      expect(formConfig).to.have.property('urlPrefix');
      expect(formConfig).to.have.property('submitUrl');
      expect(formConfig).to.have.property('formId');
      expect(formConfig).to.have.property('version');
      expect(formConfig).to.have.property('title');
      expect(formConfig).to.have.property('chapters');
    });

    it('should have correct form ID', () => {
      expect(formConfig.formId).to.equal('21P-530A');
    });

    it('should have v3 segmented progress bar enabled', () => {
      expect(formConfig.v3SegmentedProgressBar).to.be.true;
    });

    it('should have prefill disabled', () => {
      expect(formConfig.prefillEnabled).to.be.false;
    });
  });

  describe('Page Components', () => {
    it('should have introduction page', () => {
      expect(formConfig.introduction).to.exist;
    });

    it('should have confirmation page', () => {
      expect(formConfig.confirmation).to.exist;
    });

    it('should have footer content', () => {
      expect(formConfig.footerContent).to.exist;
    });

    it('should have get help component', () => {
      expect(formConfig.getHelp).to.exist;
    });

    it('should have pre-submit info', () => {
      expect(formConfig.preSubmitInfo).to.exist;
    });
  });

  describe('Save in Progress', () => {
    it('should have save in progress configuration', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress).to.be.an('object');
    });

    it('should have save in progress messages', () => {
      expect(formConfig.saveInProgress.messages).to.exist;
      expect(formConfig.saveInProgress.messages.inProgress).to.be.a('string');
      expect(formConfig.saveInProgress.messages.expired).to.be.a('string');
      expect(formConfig.saveInProgress.messages.saved).to.be.a('string');
    });
  });

  describe('Chapters', () => {
    it('should have chapters object', () => {
      expect(formConfig.chapters).to.exist;
      expect(formConfig.chapters).to.be.an('object');
    });

    it('should have organization information chapter', () => {
      expect(formConfig.chapters.organizationInformationChapter).to.exist;
      expect(formConfig.chapters.organizationInformationChapter.title).to.be.a(
        'string',
      );
      expect(formConfig.chapters.organizationInformationChapter.pages).to.be.an(
        'object',
      );
    });

    it('should have veteran information chapter', () => {
      expect(formConfig.chapters.veteranInformationChapter).to.exist;
    });

    it('should have military history chapter', () => {
      expect(formConfig.chapters.militaryHistoryChapter).to.exist;
    });

    it('should have additional remarks chapter', () => {
      expect(formConfig.chapters.additionalRemarksChapter).to.exist;
    });
  });

  describe('Veteran Information Pages', () => {
    it('should have veteranIdentification page', () => {
      expect(
        formConfig.chapters.veteranInformationChapter.pages
          .veteranIdentification,
      ).to.exist;
    });

    it('should have veteranBirthInformation page', () => {
      expect(
        formConfig.chapters.veteranInformationChapter.pages
          .veteranBirthInformation,
      ).to.exist;
    });

    it('should have veteranBurialInformation page', () => {
      expect(
        formConfig.chapters.veteranInformationChapter.pages
          .veteranBurialInformation,
      ).to.exist;
    });
  });

  describe('Submit Configuration', () => {
    it('should have submit URL', () => {
      expect(formConfig.submitUrl).to.be.a('string');
    });

    it('should have tracking prefix', () => {
      expect(formConfig.trackingPrefix).to.be.a('string');
    });
  });

  describe('Prefill', () => {
    it('should have prefill transformer', () => {
      expect(formConfig.prefillTransformer).to.exist;
      expect(formConfig.prefillTransformer).to.be.a('function');
    });
  });
});
