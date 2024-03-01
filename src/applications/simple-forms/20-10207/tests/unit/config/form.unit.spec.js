import { expect } from 'chai';
import formConfig from '../../../config/form';
import { PREPARER_TYPES } from '../../../config/constants';

describe('formConfig', () => {
  it('should be an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('should have a rootUrl property', () => {
    expect(formConfig).to.have.property('rootUrl');
    expect(formConfig.rootUrl).to.be.a('string');
  });

  describe('chapters', () => {
    it('should be an object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });
  });

  describe('page.depends functions', () => {
    describe('preparerTypeChapter page.depends', () => {
      describe('thirdPartyVeteranIdentityPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.preparerTypeChapter.pages.thirdPartyVeteranIdentityPage;

        it('returns FALSE if preparerType is veteran', () => {
          expect(depends({ preparerType: PREPARER_TYPES.VETERAN })).to.be.false;
        });

        it('returns TRUE if preparerType is third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('thirdPartyNonVeteranIdentityPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.preparerTypeChapter.pages.thirdPartyNonVeteranIdentityPage;

        it('returns FALSE if preparerType is non-veteran', () => {
          expect(depends({ preparerType: PREPARER_TYPES.NON_VETERAN })).to.be
            .false;
        });

        it('returns TRUE if preparerType is third-party-non-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });
      });
    });

    describe('personalInformationChapter page.depends', () => {
      describe('veteranNameAndDateOfBirthPageA.depends', () => {
        const {
          depends,
        } = formConfig.chapters.personalInformationChapter.pages.veteranNameAndDateOfBirthPageA;

        it('returns TRUE if preparerType is veteran or third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if preparerType is non-veteran or third-party-non-veteran', () => {
          expect(depends({ preparerType: PREPARER_TYPES.NON_VETERAN })).to.be
            .false;
          expect(
            depends({ preparerType: PREPARER_TYPES.THIRD_PARTY__NON_VETERAN }),
          ).to.be.false;
        });
      });

      describe('nonVeteranNameAndDateOfBirthPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.personalInformationChapter.pages.nonVeteranNameAndDateOfBirthPage;

        it('returns FALSE if preparerType is veteran or third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if preparerType is non-veteran or third-party-non-veteran', () => {
          expect(depends({ preparerType: PREPARER_TYPES.NON_VETERAN })).to.be
            .true;
          expect(
            depends({ preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN }),
          ).to.be.true;
        });
      });

      describe('veteranIdentificationInformationPageA.depends', () => {
        const {
          depends,
        } = formConfig.chapters.personalInformationChapter.pages.veteranIdentificationInformationPageA;

        it('returns TRUE if preparerType is veteran or third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if preparerType is non-veteran or third-party-non-veteran', () => {
          expect(depends({ preparerType: PREPARER_TYPES.NON_VETERAN })).to.be
            .false;
          expect(
            depends({ preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN }),
          ).to.be.false;
        });
      });

      describe('nonVeteranIdentificationInformationPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.personalInformationChapter.pages.nonVeteranIdentificationInformationPage;

        it('returns FALSE if preparerType is veteran or third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if preparerType is non-veteran or third-party-non-veteran', () => {
          expect(depends({ preparerType: PREPARER_TYPES.NON_VETERAN })).to.be
            .true;
          expect(
            depends({ preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN }),
          ).to.be.true;
        });
      });
    });
  });
});
