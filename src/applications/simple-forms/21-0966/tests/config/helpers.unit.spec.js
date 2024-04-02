import { expect } from 'chai';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/exports';
import sinon from 'sinon';
import {
  bypassFormCheck,
  survivingDependentContactInformationChapterTitle,
  preparerIsSurvivingDependent,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependent,
  preparerIsThirdParty,
  preparerIsVeteran,
  survivingDependentPersonalInformationChapterTitle,
  benefitSelectionChapterTitle,
  initializeFormDataWithPreparerIdentificationAndPrefill,
  hasActiveCompensationITF,
  hasActivePensionITF,
  noActiveITF,
  hasVeteranPrefill,
  statementOfTruthFullNamePath,
  veteranPersonalInformationChapterTitle,
  veteranContactInformationChapterTitle,
  confirmationPageFormBypassed,
  confirmationPageAlertStatus,
  confirmationPageAlertHeadline,
  confirmationPageAlertParagraph,
  confirmationPageNextStepsParagraph,
  getIntentsToFile,
  goPathAfterGettingITF,
  shouldSeeVeteranBenefitSelection,
  shouldSeeVeteranBenefitSelectionCompensation,
  shouldSeeVeteranBenefitSelectionPension,
  preparerIsSurvivingDependentOrThirdPartyToSurvivingDependent,
  preparerIsVeteranAndHasPrefill,
  shouldSeeVeteranPersonalInformation,
  shouldSeeVeteranIdentificationInformation,
} from '../../config/helpers';
import {
  preparerIdentifications,
  veteranBenefits,
  survivingDependentBenefits,
} from '../../definitions/constants';
import formConfig from '../../config/form';

describe('form helper functions', () => {
  it('test defaults for helper functions', () => {
    expect(preparerIsVeteran()).to.equal(false);
    expect(preparerIsSurvivingDependent()).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran()).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent()).to.equal(false);
    expect(preparerIsThirdParty()).to.equal(false);
    expect(benefitSelectionChapterTitle()).to.match(/Your benefit selection/i);
    expect(hasActiveCompensationITF()).to.equal(false);
    expect(hasActivePensionITF()).to.equal(false);
    expect(noActiveITF()).to.equal(true);
    expect(hasVeteranPrefill()).to.equal(false);
    expect(statementOfTruthFullNamePath()).to.equal(
      'survivingDependentFullName',
    );
    expect(survivingDependentPersonalInformationChapterTitle()).to.match(
      /Your personal information/i,
    );
    expect(survivingDependentContactInformationChapterTitle()).to.match(
      /Your contact information/i,
    );
    expect(veteranPersonalInformationChapterTitle()).to.match(
      /Veteran’s personal information/i,
    );
    expect(veteranContactInformationChapterTitle()).to.match(
      /Veteran’s contact information/i,
    );
  });

  it('provides the correct information for a veteran', () => {
    const formData = {
      preparerIdentification: 'VETERAN',
    };

    expect(preparerIsVeteran({ formData })).to.equal(true);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Your/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Your/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Your/i,
    );
  });

  it('provides the correct information for a surviving dependent', () => {
    const formData = {
      preparerIdentification: 'SURVIVING_DEPENDENT',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(true);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Your/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('provides the correct information for a third party to the veteran', () => {
    const formData = {
      preparerIdentification: 'THIRD_PARTY_VETERAN',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(true);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(true);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Veteran/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Veteran/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Veteran/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('provides the correct information for a third party to the surviving dependent', () => {
    const formData = {
      preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      true,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(true);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Claimant/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Claimant/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Claimant/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('provides a reasonble default', () => {
    const formData = {
      preparerIdentification: '',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Your/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('returns true for ITF functions when ITF formData values are present and false when values are empty objects', () => {
    const formData = {
      'view:activeCompensationITF': {
        expirationDate: '2025-01-30T17:56:30.512Z',
        status: 'active',
      },
      'view:activePensionITF': {},
    };

    expect(hasActiveCompensationITF({ formData })).to.equal(true);
    expect(hasActivePensionITF({ formData })).to.equal(false);
    expect(noActiveITF({ formData })).to.equal(false);

    formData['view:activeCompensationITF'] = {};
    formData['view:activePensionITF'] = {
      expirationDate: '2025-01-30T17:56:30.512Z',
      status: 'active',
    };

    expect(hasActiveCompensationITF({ formData })).to.equal(false);
    expect(hasActivePensionITF({ formData })).to.equal(true);
    expect(noActiveITF({ formData })).to.equal(false);
  });

  it('returns true for noActiveITF when there are no active ITFs', () => {
    const formData = {
      'view:activeCompensationITF': {},
      'view:activePensionITF': {},
    };

    expect(noActiveITF({ formData })).to.equal(true);
  });

  describe('shouldSeeVeteranBenefitSelection', () => {
    it('returns true when veteran has no active ITFs', () => {
      const formData = {
        preparerIdentification: 'VETERAN',
      };

      expect(shouldSeeVeteranBenefitSelection({ formData })).to.equal(true);
    });

    it('returns false when veteran has active ITFs', () => {
      const formData = {
        preparerIdentification: 'VETERAN',
        'view:activeCompensationITF': { status: 'active' },
      };

      expect(shouldSeeVeteranBenefitSelection({ formData })).to.equal(false);
    });

    it('returns false when non-veteran', () => {
      const formData = {
        preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
      };

      expect(shouldSeeVeteranBenefitSelection({ formData })).to.equal(false);
    });
  });

  describe('shouldSeeVeteranBenefitSelectionCompensation', () => {
    it('returns true when veteran has active Pension ITFs', () => {
      const formData = {
        preparerIdentification: 'VETERAN',
        'view:activePensionITF': { status: 'active' },
      };

      expect(
        shouldSeeVeteranBenefitSelectionCompensation({ formData }),
      ).to.equal(true);
    });

    it('returns false when veteran has no active ITFs', () => {
      const formData = {
        preparerIdentification: 'VETERAN',
      };

      expect(
        shouldSeeVeteranBenefitSelectionCompensation({ formData }),
      ).to.equal(false);
    });

    it('returns false when non-veteran', () => {
      const formData = {
        preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
      };

      expect(
        shouldSeeVeteranBenefitSelectionCompensation({ formData }),
      ).to.equal(false);
    });
  });

  describe('shouldSeeVeteranBenefitSelectionPension', () => {
    it('returns true when veteran has active Compensation ITFs', () => {
      const formData = {
        preparerIdentification: 'VETERAN',
        'view:activeCompensationITF': { status: 'active' },
      };

      expect(shouldSeeVeteranBenefitSelectionPension({ formData })).to.equal(
        true,
      );
    });

    it('returns false when veteran has no active ITFs', () => {
      const formData = {
        preparerIdentification: 'VETERAN',
      };

      expect(shouldSeeVeteranBenefitSelectionPension({ formData })).to.equal(
        false,
      );
    });

    it('returns false when non-veteran', () => {
      const formData = {
        preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
      };

      expect(shouldSeeVeteranBenefitSelectionPension({ formData })).to.equal(
        false,
      );
    });
  });

  describe('preparerIsSurvivingDependentOrThirdPartyToSurvivingDependent', () => {
    it('returns true when preparer is surviving dependent', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.survivingDependent,
      };

      expect(
        preparerIsSurvivingDependentOrThirdPartyToSurvivingDependent({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns true when preparer is third party to surviving dependent', () => {
      const formData = {
        preparerIdentification:
          preparerIdentifications.thirdPartySurvivingDependent,
      };

      expect(
        preparerIsSurvivingDependentOrThirdPartyToSurvivingDependent({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns false when preparer is not third party or third party to surviving dependent', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
      };

      expect(
        preparerIsSurvivingDependentOrThirdPartyToSurvivingDependent({
          formData,
        }),
      ).to.equal(false);
    });
  });

  describe('preparerIsVeteranAndHasPrefill', () => {
    it('returns true when preparer is veteran and has prefill', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
        'view:veteranPrefillStore': {
          fullName: {
            first: 'Marty',
            last: 'McFly',
          },
          ssn: '111519551',
          dateOfBirth: '1955-11-15',
        },
      };

      expect(
        preparerIsVeteranAndHasPrefill({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns false when preparer is veteran and does not have prefill', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
      };

      expect(
        preparerIsVeteranAndHasPrefill({
          formData,
        }),
      ).to.equal(false);
    });

    it('returns false when preparer is not veteran and has prefill', () => {
      const formData = {
        preparerIdentification:
          preparerIdentifications.thirdPartySurvivingDependent,
        'view:veteranPrefillStore': {
          fullName: {
            first: 'Marty',
            last: 'McFly',
          },
          ssn: '111519551',
          dateOfBirth: '1955-11-15',
        },
      };

      expect(
        preparerIsVeteranAndHasPrefill({
          formData,
        }),
      ).to.equal(false);
    });
  });

  describe('shouldSeeVeteranPersonalInformation', () => {
    it('returns true if preparer is third party to veteran', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.thirdPartyVeteran,
      };

      expect(
        shouldSeeVeteranPersonalInformation({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns true if preparer is veteran and does not have prefill', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
      };

      expect(
        shouldSeeVeteranPersonalInformation({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns false if preparer is veteran and has prefill', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
        'view:veteranPrefillStore': {
          fullName: {
            first: 'Marty',
            last: 'McFly',
          },
          ssn: '111519551',
          dateOfBirth: '1955-11-15',
        },
      };

      expect(
        shouldSeeVeteranPersonalInformation({
          formData,
        }),
      ).to.equal(false);
    });

    it('returns false if preparer is not veteran or third party to veteran', () => {
      const formData = {
        preparerIdentification:
          preparerIdentifications.thirdPartySurvivingDependent,
      };

      expect(
        shouldSeeVeteranPersonalInformation({
          formData,
        }),
      ).to.equal(false);
    });
  });

  describe('shouldSeeVeteranIdentificationInformation', () => {
    it('returns true if preparer is not veteran', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.thirdPartyVeteran,
      };

      expect(
        shouldSeeVeteranIdentificationInformation({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns true if preparer is veteran and does not have prefill', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
      };

      expect(
        shouldSeeVeteranIdentificationInformation({
          formData,
        }),
      ).to.equal(true);
    });

    it('returns false if preparer is veteran and has prefill', () => {
      const formData = {
        preparerIdentification: preparerIdentifications.veteran,
        'view:veteranPrefillStore': {
          fullName: {
            first: 'Marty',
            last: 'McFly',
          },
          ssn: '111519551',
          dateOfBirth: '1955-11-15',
        },
      };

      expect(
        shouldSeeVeteranIdentificationInformation({
          formData,
        }),
      ).to.equal(false);
    });
  });

  describe('getting the Intents to File mid-form', () => {
    describe('user is a veteran', () => {
      xit('uses goPath', () => {
        const goPath = sinon.spy();
        const goNextPath = sinon.spy();
        const setFormData = sinon.spy();
        const formData = {
          preparerIdentification: preparerIdentifications.veteran,
        };

        getIntentsToFile({
          formData,
          goPath,
          goNextPath,
          setFormData,
        });

        expect(goPath.called).to.eq(true);
        expect(goNextPath.called).to.eq(false);
        expect(setFormData.called).to.eq(false);
      });

      it('sets the form data after the call', () => {
        const compensationIntent = {};
        const pensionIntent = {};
        const goPath = sinon.spy();
        const goNextPath = sinon.spy();
        const setFormData = sinon.spy();
        const formData = {
          preparerIdentification: preparerIdentifications.veteran,
        };

        goPathAfterGettingITF(
          { compensationIntent, pensionIntent },
          formData,
          goPath,
          goNextPath,
          setFormData,
        );

        expect(setFormData.called).to.eq(true);
      });

      describe('vet has active compensation and pension ITFs', () => {
        it('sets the form data after the call', () => {
          const compensationIntent = { status: 'active' };
          const pensionIntent = { status: 'active' };
          const goPath = sinon.spy();
          const goNextPath = sinon.spy();
          const setFormData = sinon.spy();
          const formData = {
            preparerIdentification: preparerIdentifications.veteran,
          };

          goPathAfterGettingITF(
            { compensationIntent, pensionIntent },
            formData,
            goPath,
            goNextPath,
            setFormData,
          );

          expect(goPath.calledWith('confirmation')).to.eq(true);
        });
      });

      describe('vet has active compensation ITF', () => {
        it('sets the form data after the call', () => {
          const compensationIntent = { status: 'active' };
          const pensionIntent = {};
          const goPath = sinon.spy();
          const goNextPath = sinon.spy();
          const setFormData = sinon.spy();
          const formData = {
            preparerIdentification: preparerIdentifications.veteran,
          };

          goPathAfterGettingITF(
            { compensationIntent, pensionIntent },
            formData,
            goPath,
            goNextPath,
            setFormData,
          );

          expect(goPath.calledWith('veteran-benefit-selection-pension')).to.eq(
            true,
          );
        });
      });

      describe('vet has active pension ITF', () => {
        it('sets the form data after the call', () => {
          const compensationIntent = {};
          const pensionIntent = { status: 'active' };
          const goPath = sinon.spy();
          const goNextPath = sinon.spy();
          const setFormData = sinon.spy();
          const formData = {
            preparerIdentification: preparerIdentifications.veteran,
          };

          goPathAfterGettingITF(
            { compensationIntent, pensionIntent },
            formData,
            goPath,
            goNextPath,
            setFormData,
          );

          expect(
            goPath.calledWith('veteran-benefit-selection-compensation'),
          ).to.eq(true);
        });
      });

      describe('vet has no active ITFs', () => {
        it('sets the form data after the call', () => {
          const compensationIntent = {};
          const pensionIntent = {};
          const goPath = sinon.spy();
          const goNextPath = sinon.spy();
          const setFormData = sinon.spy();
          const formData = {
            preparerIdentification: preparerIdentifications.veteran,
          };

          goPathAfterGettingITF(
            { compensationIntent, pensionIntent },
            formData,
            goPath,
            goNextPath,
            setFormData,
          );

          expect(goNextPath.called).to.eq(true);
        });
      });
    });

    it('uses goNextPath when user is not a veteran', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const setFormData = sinon.spy();
      const formData = {
        preparerIdentification: 'not-a-veteran',
      };

      getIntentsToFile({
        formData,
        goPath,
        goNextPath,
        setFormData,
      });

      expect(goNextPath.called).to.eq(true);
      expect(goPath.called).to.eq(false);
      expect(setFormData.called).to.eq(false);
    });
  });

  describe('navigates to the correct page based on form data', () => {
    it('uses goNextPath when benefitSelectionPension is true', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const formData = {
        benefitSelectionPension: true,
      };

      bypassFormCheck('benefitSelectionPension', {
        formData,
        goPath,
        goNextPath,
      });

      expect(goNextPath.called).to.eq(true);
      expect(goPath.called).to.eq(false);
    });

    it('uses goPath when benefitSelectionPension is not true', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const formData = {};

      bypassFormCheck('benefitSelectionPension', {
        formData,
        goPath,
        goNextPath,
      });

      expect(goPath.called).to.eq(true);
      expect(goNextPath.called).to.eq(false);
    });

    it('uses goNextPath when benefitSelectionCompensation is true', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const formData = {
        benefitSelectionCompensation: true,
      };

      bypassFormCheck('benefitSelectionCompensation', {
        formData,
        goPath,
        goNextPath,
      });

      expect(goNextPath.called).to.eq(true);
      expect(goPath.called).to.eq(false);
    });

    it('uses goPath when benefitSelectionCompensation is not true', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const formData = {};

      bypassFormCheck('benefitSelectionCompensation', {
        formData,
        goPath,
        goNextPath,
      });

      expect(goPath.called).to.eq(true);
      expect(goNextPath.called).to.eq(false);
    });
  });
});

describe('hasVeteranPrefill', () => {
  it('returns true when veteran prefill data is present', () => {
    const formData = {
      'view:veteranPrefillStore': {
        fullName: {
          first: 'Marty',
          last: 'McFly',
        },
        ssn: '111519551',
        dateOfBirth: '1955-11-15',
      },
    };

    expect(hasVeteranPrefill({ formData })).to.be.true;
  });
  it('returns false when any part of the veteran prefill data is absent', () => {
    const formData = {
      'view:veteranPrefillStore': {
        fullName: {
          first: 'Marty',
          last: 'McFly',
        },
        dateOfBirth: '1955-11-15',
      },
    };

    expect(hasVeteranPrefill({ formData })).to.be.false;
  });
});

describe('initializeFormDataWithPreparerIdentificationAndPrefill', () => {
  it('returns an initialized formData object with preparerIdentification selection and prefill data', () => {
    const veteranPrefillStore = {
      fullName: {
        first: 'John',
        last: 'Dude',
      },
      ssn: '111223333',
      dateOfBirth: '2000-10-10',
    };

    expect(
      initializeFormDataWithPreparerIdentificationAndPrefill(
        preparerIdentifications.veteran,
        veteranPrefillStore,
      ),
    ).to.deep.equal({
      ...createInitialState(formConfig).data,
      preparerIdentification: preparerIdentifications.veteran,
      'view:veteranPrefillStore': veteranPrefillStore,
    });
  });
});

describe('statementOfTruthFullNamePath', () => {
  it('returns the required signature formData path for third parties', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.thirdPartyVeteran,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'thirdPartyPreparerFullName',
    );

    formData.preparerIdentification =
      preparerIdentifications.thirdPartySurvivingDependent;

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'thirdPartyPreparerFullName',
    );
  });

  it('returns the required signature formData path for veterans', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.veteran,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'veteranFullName',
    );
  });

  it('returns the required signature formData path for veterans with prefill', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.veteran,
      'view:veteranPrefillStore': {
        fullName: {
          first: 'Cheesy',
          last: 'Grits',
        },
        dateOfBirth: '1995-12-21',
        ssn: '555221111',
      },
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'view:veteranPrefillStore.fullName',
    );
  });

  it('returns the required signature formData path for non-third party surviving dependents', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.survivingDependent,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'survivingDependentFullName',
    );
  });
});

describe('Confirmation Page helper functions', () => {
  it('determines if the form flow was bypassed to go directly to the confirmation page', () => {
    const formData = {
      benefitSelection: {},
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;

    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
  });

  it('returns the correct alert status depending on if the form was bypassed', () => {
    const formData = {
      benefitSelection: {},
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertStatus(formData)).to.equal('warning');

    formData.benefitSelection[veteranBenefits.PENSION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageAlertStatus(formData)).to.equal('success');
  });

  it('returns the correct alert headline depending on if the form was bypassed', () => {
    const formData = {
      benefitSelection: {},
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertHeadline(formData)).to.equal(
      'You already have an intent to file on record',
    );

    formData.benefitSelection[survivingDependentBenefits.SURVIVOR] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageAlertHeadline(formData)).to.equal(
      'You’ve submitted your intent to file',
    );
  });

  it('return the correct alert paragraph depending on the formData', () => {
    const formData = {
      benefitSelection: {},
      'view:activeCompensationITF': {
        expirationDate: '2025-01-30T17:56:30.512Z',
      },
      'view:activePensionITF': {
        expirationDate: '2025-01-30T17:56:30.512Z',
      },
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'Our records show that you already have an intent to file for disability compensation and for pension claims.',
    );

    formData['view:activePensionITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'Our records show that you already have an intent to file for disability compensation and it will expire on January 30, 2025.',
    );

    formData['view:activePensionITF'] = {
      expirationDate: '2025-01-30T17:56:30.512Z',
    };
    formData['view:activeCompensationITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'Our records show that you already have an intent to file for pension claims and it will expire on January 30, 2025.',
    );

    formData['view:activePensionITF'] = {};
    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'It may take us a few days to process your intent to file for disability compensation. Then you’ll have 1 year to file your claim.',
    );

    formData.benefitSelection[veteranBenefits.PENSION] = true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'It may take us a few days to process your intent to file for disability compensation and for pension claims. Then you’ll have 1 year to file your claim.',
    );

    formData.benefitSelection[veteranBenefits.COMPENSATION] = false;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'It may take us a few days to process your intent to file for pension claims. Then you’ll have 1 year to file your claim.',
    );

    formData.benefitSelection[veteranBenefits.PENSION] = false;
    formData.benefitSelection[survivingDependentBenefits.SURVIVOR] = true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'It may take us a few days to process your intent to file for pension claims for survivors. Then you’ll have 1 year to file your claim.',
    );

    formData.benefitSelection[survivingDependentBenefits.SURVIVOR] = false;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'It may take us a few days to process your intent to file. Then you’ll have 1 year to file your claim.',
    );
  });

  it('returns the correct next steps paragraph or null depending on the formData', () => {
    const formData = {
      benefitSelection: {},
      'view:activeCompensationITF': {
        expirationDate: '2025-01-30T17:56:30.512Z',
      },
      'view:activePensionITF': {
        expirationDate: '2025-01-30T17:56:30.512Z',
      },
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'disability compensation',
    );
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims',
    );

    formData['view:activePensionITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'disability compensation',
    );

    formData['view:activePensionITF'] = {
      expirationDate: '2025-01-30T17:56:30.512Z',
    };
    formData['view:activeCompensationITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims',
    );

    formData['view:activePensionITF'] = {};
    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'disability compensation',
    );

    formData.benefitSelection[veteranBenefits.COMPENSATION] = false;
    formData.benefitSelection[veteranBenefits.PENSION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims',
    );

    formData.benefitSelection[veteranBenefits.PENSION] = false;
    formData.benefitSelection[survivingDependentBenefits.SURVIVOR] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims for survivors',
    );

    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.be.null;
  });
});
