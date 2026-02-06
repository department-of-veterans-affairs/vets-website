import { expect } from 'chai';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import formConfig from '../../config/form';

describe('Representative 526EZ Form Configuration', () => {
  it('has correct formId', () => {
    expect(formConfig.formId).to.equal(VA_FORM_IDS.FORM_21_526EZ);
  });

  it('has correct rootUrl', () => {
    expect(formConfig.rootUrl).to.equal(
      '/representative/file-disability-claim-form-21-526ez',
    );
  });

  it('has prefillEnabled set to false', () => {
    expect(formConfig.prefillEnabled).to.be.false;
  });

  it('has correct tracking prefix', () => {
    expect(formConfig.trackingPrefix).to.equal(
      'disability-526EZ-representative-',
    );
  });

  it('has introduction and confirmation pages defined', () => {
    expect(formConfig.introduction).to.exist;
    expect(formConfig.confirmation).to.exist;
  });

  it('has transformForSubmit function defined', () => {
    expect(formConfig.transformForSubmit).to.be.a('function');
  });

  describe('chapters', () => {
    it('has four chapters defined', () => {
      const chapters = Object.keys(formConfig.chapters);
      expect(chapters).to.have.length(4);
    });

    it('has veteranIdentification chapter', () => {
      const chapter = formConfig.chapters.veteranIdentification;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Veteran information');
      expect(chapter.pages.veteranIdentification).to.exist;
      expect(chapter.pages.veteranIdentification.path).to.equal(
        'veteran-identification',
      );
    });

    it('has contactInformation chapter', () => {
      const chapter = formConfig.chapters.contactInformation;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Contact information');
      expect(chapter.pages.contactInformation).to.exist;
      expect(chapter.pages.contactInformation.path).to.equal(
        'contact-information',
      );
    });

    it('has disabilities chapter', () => {
      const chapter = formConfig.chapters.disabilities;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Conditions');
      expect(chapter.pages.addDisabilities).to.exist;
      expect(chapter.pages.addDisabilities.path).to.equal('disabilities/add');
    });

    it('has supportingEvidence chapter', () => {
      const chapter = formConfig.chapters.supportingEvidence;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Supporting evidence');
      expect(chapter.pages.evidenceTypes).to.exist;
      expect(chapter.pages.evidenceTypes.path).to.equal(
        'supporting-evidence/types',
      );
    });
  });

  describe('page schemas', () => {
    it('veteranIdentification page has uiSchema and schema', () => {
      const page =
        formConfig.chapters.veteranIdentification.pages.veteranIdentification;
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.schema.type).to.equal('object');
    });

    it('contactInformation page has uiSchema and schema', () => {
      const page =
        formConfig.chapters.contactInformation.pages.contactInformation;
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.schema.type).to.equal('object');
    });

    it('addDisabilities page has uiSchema and schema', () => {
      const page = formConfig.chapters.disabilities.pages.addDisabilities;
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.schema.type).to.equal('object');
    });

    it('evidenceTypes page has uiSchema and schema', () => {
      const page = formConfig.chapters.supportingEvidence.pages.evidenceTypes;
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.schema.type).to.equal('object');
    });
  });

  describe('saveInProgress', () => {
    it('has save in progress messages defined', () => {
      expect(formConfig.saveInProgress).to.exist;
      expect(formConfig.saveInProgress.messages).to.exist;
      expect(formConfig.saveInProgress.messages.inProgress).to.be.a('string');
      expect(formConfig.saveInProgress.messages.expired).to.be.a('string');
      expect(formConfig.saveInProgress.messages.saved).to.be.a('string');
    });
  });

  describe('submitUrl', () => {
    it('points to the representative portal API endpoint', () => {
      expect(formConfig.submitUrl).to.include(
        'accredited_representative_portal',
      );
      expect(formConfig.submitUrl).to.include('submit_all_claim');
    });
  });
});
