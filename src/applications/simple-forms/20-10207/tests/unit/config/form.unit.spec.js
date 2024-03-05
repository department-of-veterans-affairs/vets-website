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

    describe('veteranPersonalInformationChapter page.depends', () => {
      describe('veteranNameAndDateOfBirthPageB.depends', () => {
        const {
          depends,
        } = formConfig.chapters.veteranPersonalInformationChapter.pages.veteranNameAndDateOfBirthPageB;

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
      });

      describe('veteranIdentificationInformationPageB.depends', () => {
        const {
          depends,
        } = formConfig.chapters.veteranPersonalInformationChapter.pages.veteranIdentificationInformationPageB;

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
      });
    });

    describe('otherReasonsChapter page.depends', () => {
      describe('otherReasonsPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.otherReasonsChapter.pages.otherReasonsPage;

        it('returns FALSE if livingSituation.NONE is FALSE', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is TRUE and preparerType is veteran or non-veteran', () => {
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

        it('returns FALSE if livingSituation.NONE is TRUE and preparerType is third-party-veteran or third-party-non-veteran', () => {
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

      describe('otherReasonsThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.otherReasonsChapter.pages.otherReasonsThirdPartyVeteranPage;

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

      describe('otherReasonsThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.otherReasonsChapter.pages.otherReasonsThirdPartyNonVeteranPage;

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

      describe('otherReasonsHomelessPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.otherReasonsChapter.pages.otherReasonsHomelessPage;

        it('returns FALSE if livingSituation.NONE is TRUE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is FALSE and preparerType is veteran or non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.true;
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.true;
        });

        it('returns FALSE if livingSituation.NONE is FALSE and preparerType is third-party-veteran or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });
      });

      describe('otherReasonsHomelessThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.otherReasonsChapter.pages.otherReasonsHomelessThirdPartyVeteranPage;

        it('returns FALSE if livingSituation.NONE is TRUE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is FALSE and preparerType is third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.true;
        });
      });

      describe('otherReasonsHomelessThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.otherReasonsChapter.pages.otherReasonsHomelessThirdPartyNonVeteranPage;

        it('returns FALSE if livingSituation.NONE is TRUE', () => {
          expect(
            depends({
              livingSituation: { NONE: true },
            }),
          ).to.be.false;
        });

        it('returns FALSE if preparerType is veteran, non-veteran, or third-party-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.NON_VETERAN,
            }),
          ).to.be.false;
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
            }),
          ).to.be.false;
        });

        it('returns TRUE if livingSituation.NONE is FALSE and preparerType is third-party-non-veteran', () => {
          expect(
            depends({
              livingSituation: { NONE: false },
              preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
            }),
          ).to.be.true;
        });
      });
    });

    describe('evidenceChapter page.depends', () => {
      describe('financialHardshipPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.evidenceChapter.pages.financialHardshipPage;

        it('returns TRUE if otherReasons.FINANCIAL_HARDSHIP is TRUE', () => {
          expect(
            depends({
              otherReasons: { FINANCIAL_HARDSHIP: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.FINANCIAL_HARDSHIP is FALSE', () => {
          expect(
            depends({
              otherReasons: { FINANCIAL_HARDSHIP: false },
            }),
          ).to.be.false;
        });
      });

      describe('terminalIllnessPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.evidenceChapter.pages.terminalIllnessPage;

        it('returns TRUE if otherReasons.TERMINAL_ILLNESS is TRUE', () => {
          expect(
            depends({
              otherReasons: { TERMINAL_ILLNESS: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.TERMINAL_ILLNESS is FALSE', () => {
          expect(
            depends({
              otherReasons: { TERMINAL_ILLNESS: false },
            }),
          ).to.be.false;
        });
      });

      describe('alsPage.depends', () => {
        const { depends } = formConfig.chapters.evidenceChapter.pages.alsPage;

        it('returns TRUE if otherReasons.ALS is TRUE', () => {
          expect(
            depends({
              otherReasons: { ALS: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.ALS is FALSE', () => {
          expect(
            depends({
              otherReasons: { ALS: false },
            }),
          ).to.be.false;
        });
      });

      describe('vsiPage.depends', () => {
        const { depends } = formConfig.chapters.evidenceChapter.pages.vsiPage;

        it('returns TRUE if otherReasons.VSI_SI is TRUE', () => {
          expect(
            depends({
              otherReasons: { VSI_SI: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.VSI_SI is FALSE', () => {
          expect(
            depends({
              otherReasons: { VSI_SI: false },
            }),
          ).to.be.false;
        });
      });

      describe('powConfinementPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.evidenceChapter.pages.powConfinementPage;

        it('returns TRUE if otherReasons.FORMER_POW is TRUE', () => {
          expect(
            depends({
              otherReasons: { FORMER_POW: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.FORMER_POW is FALSE', () => {
          expect(
            depends({
              otherReasons: { FORMER_POW: false },
            }),
          ).to.be.false;
        });
      });

      describe('powConfinement2Page.depends', () => {
        const {
          depends,
        } = formConfig.chapters.evidenceChapter.pages.powConfinement2Page;

        it('returns TRUE if otherReasons.FORMER_POW & powMultipleConfinements are TRUE', () => {
          expect(
            depends({
              otherReasons: { FORMER_POW: true },
              powMultipleConfinements: true,
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.FORMER_POW or powMultipleConfinements is FALSE', () => {
          expect(
            depends({
              otherReasons: { FORMER_POW: false },
              powMultipleConfinements: true,
            }),
          ).to.be.false;
          expect(
            depends({
              otherReasons: { FORMER_POW: true },
              powMultipleConfinements: false,
            }),
          ).to.be.false;
        });
      });

      describe('powDocumentsPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.evidenceChapter.pages.powDocumentsPage;

        it('returns TRUE if otherReasons.FORMER_POW is TRUE', () => {
          expect(
            depends({
              otherReasons: { FORMER_POW: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.FORMER_POW is FALSE', () => {
          expect(
            depends({
              otherReasons: { FORMER_POW: false },
            }),
          ).to.be.false;
        });
      });

      describe('medalAwardPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.evidenceChapter.pages.medalAwardPage;

        it('returns TRUE if otherReasons.MEDAL_AWARD is TRUE', () => {
          expect(
            depends({
              otherReasons: { MEDAL_AWARD: true },
            }),
          ).to.be.true;
        });

        it('returns FALSE if otherReasons.MEDAL_AWARD is FALSE', () => {
          expect(
            depends({
              otherReasons: { MEDAL_AWARD: false },
            }),
          ).to.be.false;
        });
      });
    });

    describe('medicalTreatmentChapter page.depends', () => {
      describe('medicalTreatmentPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.medicalTreatmentChapter.pages.medicalTreatmentPage;

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

      describe('medicalTreatmentThirdPartyVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.medicalTreatmentChapter.pages.medicalTreatmentThirdPartyVeteranPage;

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

      describe('medicalTreatmentThirdPartyNonVeteranPage.depends', () => {
        const {
          depends,
        } = formConfig.chapters.medicalTreatmentChapter.pages.medicalTreatmentThirdPartyNonVeteranPage;

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
    });
  });
});
