import { expect } from 'chai';
import formConfig from '../../../config/form';

describe('new-28-1900 formConfig', () => {
  it('is an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('has a rootUrl property', () => {
    expect(formConfig).to.have.property('rootUrl');
    expect(formConfig.rootUrl).to.be.a('string');
  });

  it('has a stepLabels string for the segmented progress bar', () => {
    expect(formConfig).to.have.property('stepLabels');
    expect(formConfig.stepLabels).to.be.a('string');
  });

  describe('chapters', () => {
    it('contains yourInformationChapter and contactInformationChapter', () => {
      expect(formConfig.chapters).to.have.all.keys(
        'yourInformationChapter',
        'contactInformationChapter',
      );
    });

    it('has static titles for both chapters', () => {
      expect(formConfig.chapters.yourInformationChapter.title).to.equal(
        'Your information',
      );
      expect(formConfig.chapters.contactInformationChapter.title).to.equal(
        'Contact information',
      );
    });
  });

  describe('page.depends functions', () => {
    describe('contactInformationChapter page.depends', () => {
      const {
        depends,
      } = formConfig.chapters.contactInformationChapter.pages.newAddressPage;

      it('returns FALSE when isMoving is false', () => {
        expect(depends({ isMoving: false })).to.be.false;
      });

      it('returns TRUE when isMoving is true', () => {
        expect(depends({ isMoving: true })).to.be.true;
      });
    });
  });
});
