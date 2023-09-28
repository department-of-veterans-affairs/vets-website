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
} from '../../config/helpers';

describe('helper functions', () => {
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

  it('provides a sane default', () => {
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
