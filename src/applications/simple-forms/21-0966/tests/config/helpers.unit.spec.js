import { expect } from 'chai';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/exports';
import {
  contactInformationStepperTitle,
  preparerIsSurvivingDependant,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependant,
  preparerIsThirdParty,
  preparerIsVeteran,
  benefitSelectionTitle,
  personalInformationStepperTitle,
  benefitSelectionStepperTitle,
  initializeFormDataWithPreparerIdentification,
  getClaimType,
  getAlreadySubmittedIntentText,
  getAlreadySubmittedTitle,
  getAlreadySubmittedText,
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
    expect(preparerIsSurvivingDependant({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependant({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionStepperTitle({ formData })).to.match(/Your/i);
    expect(benefitSelectionTitle({ formData })).to.match(/you/i);
    expect(personalInformationStepperTitle({ formData })).to.match(/Your/i);
    expect(contactInformationStepperTitle({ formData })).to.match(/Your/i);
  });

  it('provides the correct information for a surviving dependant', () => {
    const formData = {
      preparerIdentification: 'SURVIVING_DEPENDANT',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependant({ formData })).to.equal(true);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependant({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionStepperTitle({ formData })).to.match(/Your/i);
    expect(benefitSelectionTitle({ formData })).to.match(/you/i);
    expect(personalInformationStepperTitle({ formData })).to.match(/Your/i);
    expect(contactInformationStepperTitle({ formData })).to.match(/Your/i);
  });

  it('provides the correct information for a third party to the veteran', () => {
    const formData = {
      preparerIdentification: 'THIRD_PARTY_VETERAN',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependant({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(true);
    expect(preparerIsThirdPartyToASurvivingDependant({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(true);
    expect(benefitSelectionStepperTitle({ formData })).to.match(/Veteran/i);
    expect(benefitSelectionTitle({ formData })).to.match(/Veteran/i);
    expect(personalInformationStepperTitle({ formData })).to.match(/Veteran/i);
    expect(contactInformationStepperTitle({ formData })).to.match(/Veteran/i);
  });

  it('provides the correct information for a third party to the surviving dependant', () => {
    const formData = {
      preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDANT',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependant({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependant({ formData })).to.equal(
      true,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(true);
    expect(benefitSelectionStepperTitle({ formData })).to.match(/Claimant/i);
    expect(benefitSelectionTitle({ formData })).to.match(/Claimant/i);
    expect(personalInformationStepperTitle({ formData })).to.match(/Claimant/i);
    expect(contactInformationStepperTitle({ formData })).to.match(/Claimant/i);
  });

  it('provides a reasonble default', () => {
    const formData = {
      preparerIdentification: '',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependant({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependant({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionStepperTitle({ formData })).to.match(/Your/i);
    expect(benefitSelectionTitle({ formData })).to.match(/you/i);
    expect(personalInformationStepperTitle({ formData })).to.match(/Your/i);
    expect(contactInformationStepperTitle({ formData })).to.match(/Your/i);
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
