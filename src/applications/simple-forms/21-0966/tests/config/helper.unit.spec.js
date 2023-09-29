import { expect } from 'chai';
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
  getClaimType,
  getAlreadySubmittedIntentText,
  getAlreadySubmittedTitle,
  getAlreadySubmittedText,
} from '../../config/helpers';

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

describe('confirmation page helper functions', () => {
  describe('Compensation claim type', () => {
    const data = {
      benefitSelection: 'Compensation',
    };

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
      benefitSelection: 'Pension',
    };

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
      benefitSelection: 'Compensation,Pension',
    };

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
        const response = {
          compensationIntent: {
            status: 'active',
          },
        };

        expect(getAlreadySubmittedTitle(data, response)).to.match(
          /compensation/i,
        );
        expect(getAlreadySubmittedTitle(data, response)).not.to.match(
          /pension/i,
        );
      });

      it('correctly gets the title when the pension intent is active', () => {
        const response = {
          pensionIntent: {
            status: 'active',
          },
        };

        expect(getAlreadySubmittedTitle(data, response)).to.match(/pension/i);
        expect(getAlreadySubmittedTitle(data, response)).not.to.match(
          /compensation/i,
        );
      });

      it('provides a reasonable default', () => {
        const response = {};

        expect(getAlreadySubmittedTitle(data, response)).to.equal(null);
      });
    });

    describe('getting already submitted text', () => {
      it('correctly gets the text when the compensation intent is active', () => {
        const response = {
          compensationIntent: {
            status: 'active',
          },
        };

        expect(getAlreadySubmittedText(data, response, '')).to.match(
          /\(ITF\) for disability compensation/i,
        );
      });

      it('correctly gets the title when the pension intent is active', () => {
        const response = {
          pensionIntent: {
            status: 'active',
          },
        };

        expect(getAlreadySubmittedText(data, response, '')).to.match(
          /\(ITF\) for pension/i,
        );
      });

      it('provides a reasonable default', () => {
        const response = {};

        expect(getAlreadySubmittedText(data, response)).to.equal(null);
      });
    });
  });

  it('provides a reasonable default', () => {
    const data = {
      benefitSelection: '',
    };
    const alreadySubmittedIntents = {};

    expect(getClaimType(data)).to.match(/compensation/i);
    expect(getClaimType(data)).not.to.match(/pension/i);
    expect(
      getAlreadySubmittedIntentText(data, alreadySubmittedIntents, ''),
    ).to.equal(null);
  });
});
