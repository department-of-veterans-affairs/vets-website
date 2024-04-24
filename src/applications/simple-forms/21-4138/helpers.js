import { PREPARER_TYPES } from './config/constants';

export function getPreparerString(preparerType) {
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return 'Veteran’s';
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return 'Claimant’s';
    default:
      return 'Your';
  }
}

export function getPersonalInformationChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);

  return `${preparerString} personal information`;
}

export function getIdentificationInfoChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);

  return `${preparerString} identification information`;
}

export function getFullNameLabels(label, skipMiddleCheck = false) {
  if (label === 'middle name' && !skipMiddleCheck) {
    return 'Middle initial';
  }

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getNameAndDobPageTitle(formData) {
  const { preparerType } = formData;
  const titleEnding = 'name and date of birth';
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return `Veteran’s ${titleEnding}`;
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return `Claimant’s ${titleEnding}`;
    default:
      return 'Your name and date of birth';
  }
}

export function getNameAndDobPageDescription(formData) {
  const { preparerType } = formData;
  switch (preparerType) {
    case PREPARER_TYPES.NON_VETERAN:
      return 'Please provide your information as the person with the claim.';
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return 'Please provide the Veteran’s information.';
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return 'Please provide information on the person with the claim (also called the claimant).';
    default:
      return 'Please provide your information as the Veteran.';
  }
}

export function getIdentityInfoPageTitle(formData) {
  const { preparerType } = formData;
  const titleEnding = 'identification information';
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return `Veteran’s ${titleEnding}`;
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return `Claimant’s ${titleEnding}`;
    default:
      return `Your ${titleEnding}`;
  }
}

export function getVeteranIdentityInfoPageTitle(formData) {
  const titleEnding = 'identification information';
  return formData.preparerType === PREPARER_TYPES.VETERAN
    ? `Your ${titleEnding}`
    : `Veteran’s ${titleEnding}`;
}

export function getMailingAddressChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} mailing address`;
}

export function getContactInfoChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} contact information`;
}

export function getPhoneAndEmailPageTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} phone and email address`;
}

export function getStatementPageTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} statement`;
}
