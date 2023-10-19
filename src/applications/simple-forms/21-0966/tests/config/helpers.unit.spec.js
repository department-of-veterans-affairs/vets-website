import { expect } from 'chai';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/exports';
import {
  survivingDependentContactInformationChapterTitle,
  preparerIsSurvivingDependent,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependent,
  preparerIsThirdParty,
  preparerIsVeteran,
  survivingDependentPersonalInformationChapterTitle,
  benefitSelectionChapterTitle,
  initializeFormDataWithPreparerIdentification,
  statementOfTruthFullNamePath,
  getClaimType,
  getAlreadySubmittedIntentText,
  getAlreadySubmittedTitle,
  getAlreadySubmittedText,
  veteranPersonalInformationChapterTitle,
  veteranContactInformationChapterTitle,
} from '../../config/helpers';
import {
  preparerIdentifications,
  veteranBenefits,
} from '../../definitions/constants';
import formConfig from '../../config/form';

describe('form helper functions', () => {
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
});

describe('initializeFormDataWithPreparerIdentification', () => {
  it('returns an initialized formData object with preparerIdentification selection', () => {
    expect(
      initializeFormDataWithPreparerIdentification(
        preparerIdentifications.veteran,
      ),
    ).to.deep.equal({
      ...createInitialState(formConfig).data,
      preparerIdentification: preparerIdentifications.veteran,
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

  it('returns the required signature formData path for non-third party surviving dependents', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.survivingDependent,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'survivingDependentFullName',
    );
  });
});

describe('confirmation page helper functions', () => {
  describe('Compensation claim type', () => {
    const data = {
      benefitSelection: {},
    };
    data.benefitSelection[veteranBenefits.compensation] = true;

    it('correctly gets the claim type and already submitted title and text', () => {
      expect(getClaimType(data)).to.match(/compensation/i);
      expect(getClaimType(data)).not.to.match(/pension/i);
      expect(getAlreadySubmittedTitle(data, {})).to.equal(null);
      expect(getAlreadySubmittedText(data, {}, '')).to.equal(null);
    });

    describe('getting already submitted intent text', () => {
      it('correctly gets the text with an already submitted compensation intent', () => {
        const alreadySubmittedIntents = {
          compensation: {},
        };

        expect(
          getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
        ).to.match(/you already have an intent/i);
      });

      it('correctly gets the text without an already submitted compensation intent', () => {
        const alreadySubmittedIntents = {};

        expect(
          getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
        ).to.equal(null);
      });
    });
  });

  describe('Pension claim type', () => {
    const data = {
      benefitSelection: {},
    };
    data.benefitSelection[veteranBenefits.pension] = true;

    it('correctly gets the claim type and already submitted title and text', () => {
      expect(getClaimType(data)).to.match(/pension/i);
      expect(getClaimType(data)).not.to.match(/compensation/i);
      expect(getAlreadySubmittedTitle(data, {})).to.equal(null);
      expect(getAlreadySubmittedText(data, {}, '')).to.equal(null);
    });

    describe('getting already submitted intent text', () => {
      it('correctly gets the text with an already submitted compensation intent', () => {
        const alreadySubmittedIntents = {
          pension: {},
        };

        expect(
          getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
        ).to.match(/you already have an intent/i);
      });

      it('correctly gets the text without an already submitted compensation intent', () => {
        const alreadySubmittedIntents = {};

        expect(
          getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
        ).to.equal(null);
      });
    });
  });

  describe('both claim types', () => {
    const data = {
      benefitSelection: {},
    };
    data.benefitSelection[veteranBenefits.compensation] = true;
    data.benefitSelection[veteranBenefits.pension] = true;

    it('correctly gets the claim types', () => {
      expect(getClaimType(data)).to.match(/compensation and pension/i);
      expect(getClaimType(data)).not.to.match(/survivors/i);
    });

    describe('getting already submitted intent text', () => {
      it('correctly gets the text with an already submitted compensation intent', () => {
        const alreadySubmittedIntents = {
          compensation: {},
          pension: {},
        };

        expect(
          getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
        ).to.match(/you already have an intent/i);
      });

      it('correctly gets the text without an already submitted compensation intent', () => {
        const alreadySubmittedIntents = {};

        expect(
          getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
        ).to.equal(null);
      });
    });

    describe('getting already submitted title', () => {
      it('correctly gets the title when the compensation intent is active', () => {
        const alreadySubmittedIntents = {
          compensation: 'active',
        };

        expect(
          getAlreadySubmittedTitle(data, alreadySubmittedIntents),
        ).to.match(/compensation/i);
        expect(
          getAlreadySubmittedTitle(data, alreadySubmittedIntents),
        ).not.to.match(/pension/i);
      });

      it('correctly gets the title when the pension intent is active', () => {
        const alreadySubmittedIntents = {
          pension: 'active',
        };

        expect(
          getAlreadySubmittedTitle(data, alreadySubmittedIntents),
        ).to.match(/pension/i);
        expect(
          getAlreadySubmittedTitle(data, alreadySubmittedIntents),
        ).not.to.match(/compensation/i);
      });

      it('provides a reasonable default', () => {
        const alreadySubmittedIntents = {};

        expect(
          getAlreadySubmittedTitle(data, alreadySubmittedIntents),
        ).to.equal(null);
      });
    });

    describe('getting already submitted text', () => {
      it('correctly gets the text when the compensation intent is active', () => {
        const alreadySubmittedIntents = {
          compensation: 'active',
        };

        expect(
          getAlreadySubmittedText(data, alreadySubmittedIntents, ''),
        ).to.match(/\(ITF\) for disability compensation/i);
      });

      it('correctly gets the title when the pension intent is active', () => {
        const alreadySubmittedIntents = {
          pension: 'active',
        };

        expect(
          getAlreadySubmittedText(data, alreadySubmittedIntents, ''),
        ).to.match(/\(ITF\) for pension/i);
      });

      it('provides a reasonable default', () => {
        const alreadySubmittedIntents = {};

        expect(getAlreadySubmittedText(data, alreadySubmittedIntents)).to.equal(
          null,
        );
      });
    });
  });

  it('provides a reasonable default', () => {
    const data = {
      benefitSelection: {},
    };
    const alreadySubmittedIntents = {};

    expect(getClaimType(data)).not.to.match(/compensation/i);
    expect(getClaimType(data)).to.match(/pension/i);
    expect(
      getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
    ).to.equal(null);
  });
});
