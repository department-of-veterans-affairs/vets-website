import { preparerIdentificationKeys } from '../definitions/constants';

export const preparerIsVeteran = ({ formData } = {}) => {
  // key 0 corresponds to claimant is the Veteran
  return formData?.preparerIdentification === preparerIdentificationKeys[0];
};

export const preparerIsSurvivingDependant = ({ formData } = {}) => {
  // key 1 corresponds to claimant is a Surviving Dependant
  return formData?.preparerIdentification === preparerIdentificationKeys[1];
};

export const preparerIsThirdPartyToTheVeteran = ({ formData } = {}) => {
  // key 2 corresponds to claimant is a Third Party to the Veteran
  return formData?.preparerIdentification === preparerIdentificationKeys[2];
};

export const preparerIsThirdPartyToASurvivingDependant = ({
  formData,
} = {}) => {
  // key 3 corresponds to claimant is a Third Party to a Surviving Dependant
  return formData?.preparerIdentification === preparerIdentificationKeys[3];
};

export const preparerIsThirdParty = ({ formData } = {}) => {
  return (
    preparerIsThirdPartyToTheVeteran({ formData }) ||
    preparerIsThirdPartyToASurvivingDependant({ formData })
  );
};

export const benefitSelectionStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentificationKeys[0]:
    case preparerIdentificationKeys[1]:
      return 'Your benefit selection';
    case preparerIdentificationKeys[2]:
      return 'Veteran’s benefit selection';
    case preparerIdentificationKeys[3]:
      return 'Claimant’s benefit selection';
    default:
      return 'Your benefit selection';
  }
};

export const benefitSelectionTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentificationKeys[0]:
    case preparerIdentificationKeys[1]:
      return 'Select the benefits you intend to file a claim for. Select all that apply';
    case preparerIdentificationKeys[2]:
      return 'Select the benefits the Veteran intends to file a claim for. Select all that apply';
    case preparerIdentificationKeys[3]:
      return 'Select the benefits the Claimant intends to file a claim for. Select all that apply';
    default:
      return 'Select the benefits you intend to file a claim for. Select all that apply';
  }
};

export const personalInformationStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentificationKeys[0]:
    case preparerIdentificationKeys[1]:
      return 'Your personal information';
    case preparerIdentificationKeys[2]:
      return 'Veteran’s personal information';
    case preparerIdentificationKeys[3]:
      return 'Claimant’s personal information';
    default:
      return 'Your personal information';
  }
};

export const contactInformationStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentificationKeys[0]:
    case preparerIdentificationKeys[1]:
      return 'Your contact information';
    case preparerIdentificationKeys[2]:
      return 'Veteran’s contact information';
    case preparerIdentificationKeys[3]:
      return 'Claimant’s contact information';
    default:
      return 'Your contact information';
  }
};
