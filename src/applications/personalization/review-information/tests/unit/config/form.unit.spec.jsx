import { expect } from 'chai';
import formConfig from '../../../config/form';

describe('formConfig', () => {
  it('is an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('has a rootUrl property', () => {
    expect(formConfig).to.have.property('rootUrl');
    expect(formConfig.rootUrl).to.be.a('string');
  });

  it('has a formId property', () => {
    expect(formConfig).to.have.property('formId');
    expect(formConfig.formId).to.be.a('string');
  });

  it('has a chapters property', () => {
    expect(formConfig).to.have.property('chapters');
    expect(formConfig.chapters).to.be.an('object');
  });

  describe('chapters', () => {
    it('contains the infoPage chapter', () => {
      expect(formConfig.chapters).to.have.property('infoPage');
      expect(formConfig.chapters.infoPage).to.be.an('object');
    });

    it('contains pages in the infoPage chapter', () => {
      const { infoPage } = formConfig.chapters;
      expect(infoPage).to.have.property('pages');
      expect(infoPage.pages).to.be.an('object');
    });

    it('includes a contact information page', () => {
      const contactInfoPage =
        formConfig.chapters.infoPage.pages.confirmContactInfo;
      expect(contactInfoPage).to.exist;
      expect(contactInfoPage).to.be.an('object');
      expect(contactInfoPage).to.have.property('CustomPage');
    });
  });

  describe('contact information page', () => {
    const contactInfoPage =
      formConfig.chapters.infoPage.pages.confirmContactInfo;

    it('has an onNavForward method', () => {
      expect(contactInfoPage).to.have.property('onNavForward');
      expect(contactInfoPage.onNavForward).to.be.a('function');
    });

    it('onNavForward navigates to the confirmation path', () => {
      const mockGoPath = path => expect(path).to.equal('confirmation');
      contactInfoPage.onNavForward({ goPath: mockGoPath });
    });

    it('has an onNavBack method', () => {
      expect(contactInfoPage).to.have.property('onNavBack');
      expect(contactInfoPage.onNavBack).to.be.a('function');
    });

    it('onNavBack redirects to the My VA page', () => {
      const originalLocation = window.location;

      contactInfoPage.onNavBack();
      expect(window.location).to.equal('https://dev.va.gov/my-va/');

      global.window.location = originalLocation;
    });
  });

  describe('submit function', () => {
    it('exists and returns a promise with a confirmation number', async () => {
      const result = await formConfig.submit();
      expect(result).to.be.an('object');
      expect(result.attributes).to.have.property('confirmationNumber');
      expect(result.attributes.confirmationNumber).to.be.a('string');
    });
  });

  describe('footerContent', () => {
    it('exists as a property', () => {
      expect(formConfig).to.have.property('footerContent');
      expect(formConfig.footerContent).to.be.a('function');
    });
  });

  describe('savedFormMessages', () => {
    it('includes a notFound message', () => {
      expect(formConfig.savedFormMessages).to.have.property('notFound');
      expect(formConfig.savedFormMessages.notFound).to.be.a('string');
    });

    it('includes a noAuth message', () => {
      expect(formConfig.savedFormMessages).to.have.property('noAuth');
      expect(formConfig.savedFormMessages.noAuth).to.be.a('string');
    });
  });

  describe('formOptions', () => {
    it('includes a noTopNav property', () => {
      expect(formConfig.formOptions).to.have.property('noTopNav');
      expect(formConfig.formOptions.noTopNav).to.be.true;
    });
  });
});
