import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import {
  preparerIdentifications,
  benefitPhrases,
} from '../definitions/constants';
import formConfig from './form';

export const preparerIsVeteran = ({ formData } = {}) => {
  return formData?.preparerIdentification === preparerIdentifications.veteran;
};

export const preparerIsSurvivingDependent = ({ formData } = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.survivingDependent
  );
};

export const preparerIsThirdPartyToTheVeteran = ({ formData } = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.thirdPartyVeteran
  );
};

export const preparerIsThirdPartyToASurvivingDependent = ({
  formData,
} = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.thirdPartySurvivingDependent
  );
};

export const preparerIsThirdParty = ({ formData } = {}) => {
  return (
    preparerIsThirdPartyToTheVeteran({ formData }) ||
    preparerIsThirdPartyToASurvivingDependent({ formData })
  );
};

export const statementOfTruthFullNamePath = ({ formData } = {}) => {
  if (preparerIsThirdParty({ formData })) {
    return 'thirdPartyPreparerFullName';
  }
  if (preparerIsVeteran({ formData })) {
    return 'veteranFullName';
  }
  return 'survivingDependentFullName';
};

export const benefitSelectionStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Your benefit selection';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s benefit selection';
    case preparerIdentifications.thirdPartySurvivingDependent:
      return 'Claimant’s benefit selection';
    default:
      return 'Your benefit selection';
  }
};

export const benefitSelectionTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Select the benefits you intend to file a claim for. Select all that apply';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Select the benefits the Veteran intends to file a claim for. Select all that apply';
    case preparerIdentifications.thirdPartySurvivingDependent:
      return 'Select the benefits the Claimant intends to file a claim for. Select all that apply';
    default:
      return 'Select the benefits you intend to file a claim for. Select all that apply';
  }
};

export const personalInformationStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Your personal information';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s personal information';
    case preparerIdentifications.thirdPartySurvivingDependent:
      return 'Claimant’s personal information';
    default:
      return 'Your personal information';
  }
};

export const contactInformationStepperTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Your contact information';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s contact information';
    case preparerIdentifications.thirdPartySurvivingDependent:
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
const benefitSelections = data =>
  Object.keys(data.benefitSelection).filter(key => data.benefitSelection[key]);

const alreadySubmittedBenefitIntents = alreadySubmittedIntents =>
  Object.keys(alreadySubmittedIntents).filter(
    key => alreadySubmittedIntents[key],
  );

const benefitHasAlreadyBeenSubmitted = (
  benefitSelection,
  alreadySubmittedIntents,
) => {
  const intents = alreadySubmittedBenefitIntents(alreadySubmittedIntents);
  if (intents.length === 0) return false;

  return !intents.includes(benefitSelection);
};

const isAlreadySubmitted = (data, alreadySubmittedIntents) => {
  return benefitSelections(data).some(benefitSelection =>
    benefitHasAlreadyBeenSubmitted(benefitSelection, alreadySubmittedIntents),
  );
};

export const getAlertType = (data, alreadySubmittedIntents) => {
  if (
    benefitSelections(data).some(
      benefitSelection =>
        !alreadySubmittedBenefitIntents(alreadySubmittedIntents).includes(
          benefitSelection,
        ),
    )
  ) {
    return 'success';
  }

  return 'info';
};

export const getSuccessAlertTitle = (data, alreadySubmittedIntents) => {
  const newlySelectedBenefit = benefitSelections(data).find(benefitSelection =>
    benefitHasAlreadyBeenSubmitted(benefitSelection, alreadySubmittedIntents),
  );

  if (newlySelectedBenefit) {
    return `You’ve submitted your intent to file for ${
      benefitPhrases[newlySelectedBenefit]
    }`;
  }

  return 'You’ve submitted your intent to file';
};

export const getSuccessAlertText = (
  data,
  alreadySubmittedIntents,
  expirationDate,
) => {
  let benefitSelection = benefitSelections(data)[0];
  if (benefitSelections(data).length > 1) {
    benefitSelection = 'COMPENSATION_AND_PENSION';
  }

  const benefitPhrase = benefitPhrases[benefitSelection];
  if (Object.keys(alreadySubmittedIntents).length > 0) {
    return `Your intent to file will expire on ${expirationDate}.`;
  }

  return `Your intent to file for ${benefitPhrase} will expire on ${expirationDate}.`;
};

export const getInfoAlertTitle = () =>
  'You’ve already submitted an intent to file';

export const getInfoAlertText = (data, alreadySubmittedIntents) => {
  const benefitSelection = benefitSelections(data)[0];
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const expirationDate = new Date(
    alreadySubmittedIntents[benefitSelection].expirationDate,
  ).toLocaleDateString('en-US', dateOptions);
  if (benefitSelections(data).length > 1) {
    return 'Our records show that you already have an intent to file for disability compensation and for pension claims.';
  }

  const benefitPhrase = benefitPhrases[benefitSelection];
  return `Our records show that you already have an intent to file for ${benefitPhrase} and it will expire on ${expirationDate}.`;
};

export const getAlreadySubmittedTitle = (data, alreadySubmittedIntents) => {
  if (!isAlreadySubmitted(data, alreadySubmittedIntents)) {
    return null;
  }

  let alreadySubmittedIntent = alreadySubmittedBenefitIntents(
    alreadySubmittedIntents,
  )[0];
  if (alreadySubmittedBenefitIntents(alreadySubmittedIntents).length > 1) {
    alreadySubmittedIntent = 'COMPENSATION_AND_PENSION';
  }

  return `You’ve already submitted an intent to file for ${
    benefitPhrases[alreadySubmittedIntent]
  }`;
};

export const getAlreadySubmittedText = (data, alreadySubmittedIntents) => {
  if (!isAlreadySubmitted(data, alreadySubmittedIntents)) {
    return null;
  }

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let expirationDate;
  let alreadySubmittedIntent = alreadySubmittedBenefitIntents(
    alreadySubmittedIntents,
  )[0];
  if (alreadySubmittedBenefitIntents(alreadySubmittedIntents).length > 1) {
    expirationDate = new Date(
      alreadySubmittedIntents.pension?.expirationDate,
    ).toLocaleDateString('en-US', dateOptions);
    alreadySubmittedIntent = 'COMPENSATION_AND_PENSION';
  } else {
    expirationDate = new Date(
      alreadySubmittedIntents[alreadySubmittedIntent]?.expirationDate,
    ).toLocaleDateString('en-US', dateOptions);
  }

  return `Our records show that you already have an intent to file for ${
    benefitPhrases[alreadySubmittedIntent]
  }. Your intent to file for ${
    benefitPhrases[alreadySubmittedIntent]
  } expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
};

export const getNextStepsTextSecondParagraph = (
  data,
  alreadySubmittedIntents,
  newExpirationDate,
) => {
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const benefitSelection = benefitSelections(data)[0];
  if (benefitSelections(data).length > 1) {
    if (
      alreadySubmittedIntents?.compensation &&
      alreadySubmittedIntents?.pension
    ) {
      const compensationExpirationDate = new Date(
        alreadySubmittedIntents.compensation.expirationDate,
      ).toLocaleDateString('en-US', dateOptions);
      const pensionExpirationDate = new Date(
        alreadySubmittedIntents.pension.expirationDate,
      ).toLocaleDateString('en-US', dateOptions);
      return `Your intent to file for disability compensation expires on ${compensationExpirationDate} and your intent to file for pension claims expires on ${pensionExpirationDate}. You’ll need to file your claims by these dates to get retroactive payments (payments for the time between when you submit your intent to file and when we approve your claim).`;
    }
    return 'You’ll need to file your claims within 1 year to get retroactive payments (payments for the time between when you submit your intent to file and when we approve your claim).';
  }

  let expirationDate = newExpirationDate;
  const oldExpirationDate =
    alreadySubmittedIntents[benefitSelection]?.expirationDate;
  if (oldExpirationDate) {
    expirationDate = new Date(
      alreadySubmittedIntents[benefitSelection].expirationDate,
    ).toLocaleDateString('en-US', dateOptions);
  }

  return `Your intent to file for ${
    benefitPhrases[benefitSelection]
  } expires on ${expirationDate}. You’ll need to file your claim by this date to get retroactive payments (payments for the time between when you submit your intent to file and when we approve your claim).`;
};

export const getNextStepsLinks = data => {
  return Object.keys(data.benefitSelection).filter(
    key => data.benefitSelection[key],
  );
};
