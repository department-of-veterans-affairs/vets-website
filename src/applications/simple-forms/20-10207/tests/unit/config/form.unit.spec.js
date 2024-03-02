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

    describe('livingSituationChapter page.depends', () => {
      describe('livingSituationPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.livingSituationChapter.pages.livingSituationPage;

        it('returns TRUE if preparerType is veteran or non-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if preparerType is third-party-veteran or third-party-non-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });
      });

      describe('livingSituationThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.livingSituationChapter.pages.livingSituationThirdPartyVeteranPage;

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if preparerType is third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('livingSituationThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.livingSituationChapter.pages.livingSituationThirdPartyNonVeteranPage;

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if preparerType is third-party-non-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('otherHousingRiskPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.livingSituationChapter.pages.otherHousingRiskPage;

        it('returns FALSE if livingSituation.OTHER_RISK is FALSE', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: false },
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.OTHER_RISK is TRUE and preparerType is veteran or non-veteran', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if preparerType is third-party', () => {
          expect(
            depends({
              livingSituation: {
                OTHER_RISK: true,
                preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
              },
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: {
                OTHER_RISK: true,
                preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
              },
            }),
          ).to.be.false;
        });
      });

      describe('otherHousingRiskThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.livingSituationChapter.pages.otherHousingRiskThirdPartyVeteranPage;

        it('returns FALSE if livingSituation.OTHER_RISK is FALSE', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.OTHER_RISK is TRUE and preparerType is third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('otherHousingRiskThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.livingSituationChapter.pages.otherHousingRiskThirdPartyNonVeteranPage;

        it('returns FALSE if livingSituation.OTHER_RISK is FALSE', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.OTHER_RISK is TRUE and preparerType is third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { OTHER_RISK: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });
      });
    });

    describe('contactInformationChapter page.depends', () => {
      describe('mailingAddressYesNoPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.mailingAddressYesNoPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns TRUE if preparerType is veteran or non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if preparerType is third-party-veteran or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });
      });

      describe('mailingAddressYesNoThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.mailingAddressYesNoThirdPartyVeteranPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and preparerType is third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('mailingAddressYesNoThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.mailingAddressYesNoThirdPartyNonVeteranPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and preparerType is third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('veteranMailingAddressPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.veteranMailingAddressPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if mailingAddressYesNo is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: false,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and mailingAddressYesNo is TRUE and preparerType is veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if livingSituation.NONE is TRUE and mailingAddressYesNo is TRUE and preparerType is non-veteran, third-party-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });
      });

      describe('nonVeteranMailingAddressPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.nonVeteranMailingAddressPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if mailingAddressYesNo is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: false,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and mailingAddressYesNo is TRUE and preparerType is non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if livingSituation.NONE is TRUE and mailingAddressYesNo is TRUE and preparerType is veteran, third-party-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });
      });

      describe('veteranMailingAddressThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.veteranMailingAddressThirdPartyVeteranPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if mailingAddressYesNo is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: false,
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and mailingAddressYesNo is TRUE and preparerType is third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('nonVeteranMailingAddressThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.nonVeteranMailingAddressThirdPartyNonVeteranPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns FALSE if mailingAddressYesNo is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: false,
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and mailingAddressYesNo is TRUE and preparerType is third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
              mailingAddressYesNo: true,
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('veteranPhoneAndEmailPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.veteranPhoneAndEmailPage;

        it('returns TRUE if livingSituation.NONE is TRUE and preparerType is veteran or third-party-veteran', () => {
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
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: true },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });
      });

      describe('nonVeteranPhoneAndEmailPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.contactInformationChapter.pages.nonVeteranPhoneAndEmailPage;

        it('returns TRUE if preparerType is non-veteran or third-party-non-veteran', () => {
          expect(
            depends({
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });

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
      });
    });
  });
});
