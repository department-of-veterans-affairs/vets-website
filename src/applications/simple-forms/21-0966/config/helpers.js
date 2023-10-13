import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/exports';
import {
  preparerIdentifications,
  veteranBenefits,
} from '../definitions/constants';
import formConfig from './form';

export const preparerIsVeteran = ({ formData } = {}) => {
  return formData?.preparerIdentification === preparerIdentifications.veteran;
};

export const preparerIsSurvivingDependant = ({ formData } = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.survivingDependant
  );
};

export const preparerIsThirdPartyToTheVeteran = ({ formData } = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.thirdPartyVeteran
  );
};

export const preparerIsThirdPartyToASurvivingDependant = ({
  formData,
} = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.thirdPartySurvivingDependant
  );
};

export const preparerIsThirdParty = ({ formData } = {}) => {
  return (
    preparerIsThirdPartyToTheVeteran({ formData }) ||
    preparerIsThirdPartyToASurvivingDependant({ formData })
  );
};

export const benefitSelectionStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependant:
      return 'Your benefit selection';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s benefit selection';
    case preparerIdentifications.thirdPartySurvivingDependant:
      return 'Claimant’s benefit selection';
    default:
      return 'Your benefit selection';
  }
};

export const benefitSelectionTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependant:
      return 'Select the benefits you intend to file a claim for. Select all that apply';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Select the benefits the Veteran intends to file a claim for. Select all that apply';
    case preparerIdentifications.thirdPartySurvivingDependant:
      return 'Select the benefits the Claimant intends to file a claim for. Select all that apply';
    default:
      return 'Select the benefits you intend to file a claim for. Select all that apply';
  }
};

export const personalInformationStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependant:
      return 'Your personal information';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s personal information';
    case preparerIdentifications.thirdPartySurvivingDependant:
      return 'Claimant’s personal information';
    default:
      return 'Your personal information';
  }
};

export const contactInformationStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependant:
      return 'Your contact information';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s contact information';
    case preparerIdentifications.thirdPartySurvivingDependant:
      return 'Claimant’s contact information';
    default:
      return 'Your contact information';
  }
};

export const initializeFormDataWithPreparerIdentification = preparerIdentification => {
  return set(
    'preparerIdentification',
    preparerIdentification,
    createInitialState(formConfig).data,
  );
};

// Confirmation Page
export const getClaimType = data => {
  const benefitSelection = Object.keys(data.benefitSelection).filter(
    key => data.benefitSelection[key],
  );

  if (
    preparerIsSurvivingDependant({ formData: data }) ||
    preparerIsThirdPartyToASurvivingDependant({ formData: data })
  ) {
    return 'pension claim for survivors';
  }
  if (
    benefitSelection.includes(veteranBenefits.compensation) &&
    benefitSelection.includes(veteranBenefits.pension)
  ) {
    return 'disability compensation and pension claims';
  }

  if (benefitSelection.includes(veteranBenefits.compensation)) {
    return 'disability compensation claim';
  }

  return 'pension claim';
};

export const getAlreadySubmittedIntentText = (
  data,
  alreadySubmittedIntents,
  expirationDate,
) => {
  const benefitSelection = Object.keys(data.benefitSelection).filter(
    key => data.benefitSelection[key],
  );

  if (
    preparerIsSurvivingDependant({ formData: data }) ||
    (preparerIsThirdPartyToASurvivingDependant({ formData: data }) &&
      alreadySubmittedIntents.survivors)
  ) {
    return `Our records show that you already have an intent to file for a pension claim for survivors and it will expire on ${expirationDate}.`;
  }
  if (
    benefitSelection.includes(veteranBenefits.compensation) &&
    benefitSelection.includes(veteranBenefits.pension) &&
    alreadySubmittedIntents.compensation &&
    alreadySubmittedIntents.pension
  ) {
    return 'Our records show that you already have an intent to file for disability compensation and for pension claims.';
  }
  if (
    benefitSelection.includes(veteranBenefits.compensation) &&
    alreadySubmittedIntents.compensation
  ) {
    return `Our records show that you already have an intent to file for a disability compensation claim and it will expire on ${expirationDate}.`;
  }
  if (
    benefitSelection.includes(veteranBenefits.pension) &&
    alreadySubmittedIntents.pension
  ) {
    return `Our records show that you already have an intent to file for a pension claim and it will expire on ${expirationDate}.`;
  }

  return null;
};

export const getAlreadySubmittedTitle = (data, alreadySubmittedIntents) => {
  const benefitSelection = Object.keys(data.benefitSelection).filter(
    key => data.benefitSelection[key],
  );

  if (
    benefitSelection.includes(veteranBenefits.compensation) &&
    alreadySubmittedIntents.compensation === 'active'
  ) {
    return 'You’ve already submitted an intent to file for a disability compensation claim';
  }

  if (
    benefitSelection.includes(veteranBenefits.pension) &&
    alreadySubmittedIntents.pension === 'active'
  ) {
    return 'You’ve already submitted an intent to file for a pension claim';
  }

  return null;
};

export const getAlreadySubmittedText = (
  data,
  alreadySubmittedIntents,
  expirationDate,
) => {
  const benefitSelection = Object.keys(data.benefitSelection).filter(
    key => data.benefitSelection[key],
  );

  if (
    benefitSelection.includes(veteranBenefits.compensation) &&
    alreadySubmittedIntents.compensation === 'active'
  ) {
    return `Our records show that you already have an Intent to File (ITF) for disability compensation. Your intent to file for disability compensation expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
  }

  if (
    benefitSelection.includes(veteranBenefits.pension) &&
    alreadySubmittedIntents.pension === 'active'
  ) {
    return `Our records show that you already have an Intent to File (ITF) for pension. Your intent to file for disability compensation expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
  }

  return null;
};
