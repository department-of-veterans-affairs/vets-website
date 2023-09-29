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

export const getClaimType = data => {
  switch (data.benefitSelection) {
    case 'Compensation':
      return 'disability compensation claim';
    case 'Pension':
      if (
        preparerIsSurvivingDependant({ formData: data }) ||
        preparerIsThirdPartyToASurvivingDependant({ formData: data })
      ) {
        return 'pension claim for survivors';
      }
      return 'pension claim';
    case 'Compensation,Pension':
      return 'disability compensation and pension claims';
    default:
      return 'disability compensation claim';
  }
};

export const getAlreadySubmittedIntentText = (
  data,
  alreadySubmittedIntents,
  expirationDate,
) => {
  switch (data.benefitSelection) {
    case 'Compensation':
      if (alreadySubmittedIntents.compensation) {
        return `Our records show that you already have an intent to file for a disability compensation claim and it will expire on ${expirationDate}.`;
      }

      return null;
    case 'Pension':
      if (alreadySubmittedIntents.pension) {
        return `Our records show that you already have an intent to file for a ${getClaimType(
          data,
        )} and it will expire on ${expirationDate}.`;
      }

      return null;
    case 'Compensation,Pension':
      if (
        alreadySubmittedIntents.compensation &&
        alreadySubmittedIntents.pension
      ) {
        return 'Our records show that you already have an intent to file for disability compensation and for pension claims.';
      }

      return null;
    default:
      return null;
  }
};

export const getAlreadySubmittedTitle = (data, response) => {
  if (data.benefitSelection === 'Compensation,Pension') {
    if (response?.compensationIntent?.status === 'active') {
      return 'You’ve already submitted an intent to file for a disability compensation claim';
    }
    if (response?.pensionIntent?.status === 'active') {
      return 'You’ve already submitted an intent to file for a pension claim';
    }

    return null;
  }
  return null;
};

export const getAlreadySubmittedText = (data, response, expirationDate) => {
  if (data.benefitSelection === 'Compensation,Pension') {
    if (response?.compensationIntent?.status === 'active') {
      return `Our records show that you already have an Intent to File (ITF) for disability compensation. Your intent to file for disability compensation expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
    }
    if (response?.pensionIntent?.status === 'active') {
      return `Our records show that you already have an Intent to File (ITF) for pension. Your intent to file for disability compensation expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
    }

    return null;
  }
  return null;
};
