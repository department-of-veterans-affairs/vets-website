import {
  claimantIdentificationDisplayOptions,
  claimantIdentificationKeys,
} from '../definitions/constants';

export const getClaimantIdentificationText = formData => {
  return (
    claimantIdentificationDisplayOptions[(formData?.claimantIdentification)] ||
    'Claimant'
  );
};

export const claimantIsNotVeteran = ({ formData } = {}) => {
  // key 0 corresponds to claimant is the Veteran
  return formData?.claimantIdentification !== claimantIdentificationKeys[0];
};

export const claimantPersonalInformationTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} personal information`;
};

export const claimantSsnTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} identification information`;
};

export const claimantAddressTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} mailing address`;
};

export const claimantContactInformationTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} contact information`;
};

export const preparerQualificationsQuestionTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `What is your relationship to the ${claimantIdentificationText}? (Check all that apply)`;
};

export const preparerSigningReasonQuestionTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `Why does the ${claimantIdentificationText} need you to sign on their behalf? (Check all that apply)`;
};

export const claimantExpectedInformationDescription = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `Now, we’ll ask you about the ${claimantIdentificationText} you’ll be certifying to sign for`;
};

export const veteranDescriptionText = ({ formData } = {}) => {
  let descriptionText = '';
  if (claimantIsNotVeteran({ formData })) {
    const claimantIdentificationText = getClaimantIdentificationText(formData);
    descriptionText = `Next we’ll ask you about the Veteran connected to the ${claimantIdentificationText} you are certifying for.`;
  }
  return descriptionText;
};
